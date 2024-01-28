/* eslint-disable no-console */
import axios from 'axios';
import {doc, getDoc, setDoc} from 'firebase/firestore/lite';
import {NextApiRequest, NextApiResponse} from 'next';
import {uuid} from 'uuidv4';
import {DOMParser as Dom} from 'xmldom';
import xpath from 'xpath';

import db from '../../configs/firebase';
import {obtainToken} from '../api/common';
import {Source} from '../db/models';
import {DataBase} from '../db/types';

type GetPageByUrlArgs = {
    url: string;
};

export const getPageByUrl = async ({url}: GetPageByUrlArgs) => {
    const {data, status} = await axios.get(url);

    if (status < 200 && status > 299) {
        return;
    }
    const docRef = doc(
        db,
        'folders/Cp3YffurrZEdlrWzs02X/sources/7af823a2-9103-4061-95c5-b3152f1229b7',
    );
    const docSnap = await getDoc(docRef);
    const source = docSnap.data() as Source;
    const config = source.configs.item;

    const entries = Object.entries(config);

    const childrenXpaths = entries.filter(([key]) => key !== 'container');
    const parentXPath = entries.reduce((acc: string | null, [key, value]) => {
        if (acc) {
            return acc;
        }

        if (key === 'container') {
            return value;
        }

        return acc;
    }, null);

    if (!parentXPath) {
        return;
    }
    const document = new Dom().parseFromString(data);
    const nodes = xpath.select(parentXPath, document);

    if (!nodes || !Array.isArray(nodes)) {
        return;
    }

    nodes.forEach(async (node) => {
        const objectToSave: Record<string, string> = {};
        childrenXpaths.forEach(([field, xPath]) => {
            const childNodes = xpath.select(xPath.split(parentXPath + '/')[1], node) as Node[];
            childNodes?.forEach((chNode) => {
                objectToSave[field] = chNode.textContent || '';
                if (chNode.nodeName === 'a') {
                    const hrefNode = xpath.select('@href', chNode) as Attr[];
                    if (hrefNode[0]) {
                        objectToSave.href = hrefNode[0].value;
                        objectToSave.id = objectToSave.href.split('/').filter(Boolean).join('-');
                    }
                }
            });
        });

        const safeRef = doc(
            db,
            'folders/Cp3YffurrZEdlrWzs02X/database/7af823a2-9103-4061-95c5-b3152f1229b7/data/' +
                objectToSave.id,
        );

        await setDoc(safeRef, objectToSave);
    });
};

type GetFromBackofficeArgs<T> = {
    url: string;
    req: NextApiRequest;
    res: NextApiResponse<DataBase<T>>;
};

export const getFromBackoffice = async ({url, req, res}: GetFromBackofficeArgs<{}>) => {
    const tokenId = await obtainToken(req, res);

    if (!tokenId) {
        res.status(404).json({
            ok: false,
            message: 'tokenId is not provided',
        });

        return;
    }

    const sourceId = req.body.sourceId as string;

    if (!sourceId) {
        res.status(404).json({
            ok: false,
            message: 'sourceId is not provided',
        });

        return;
    }

    const {data, status} = await axios.get(url);

    if (status < 200 && status > 299) {
        return;
    }
    const docRef = doc(db, `folders/${tokenId}/sources/${sourceId}`);
    const docSnap = await getDoc(docRef);
    const source = docSnap.data() as Source;
    const config = source.configs.item;

    const entries = Object.entries(config);

    const childrenXpaths = entries.filter(([key]) => key !== 'container');
    const parentXPath = entries.reduce((acc: string | null, [key, value]) => {
        if (acc) {
            return acc;
        }

        if (key === 'container') {
            return value;
        }

        return acc;
    }, null);

    if (!parentXPath) {
        return;
    }
    const document = new Dom().parseFromString(data);
    const nodes = xpath.select(parentXPath, document);

    if (!nodes || !Array.isArray(nodes)) {
        return;
    }

    nodes.forEach(async (node) => {
        const objectToSave: Record<string, string> = {};
        childrenXpaths.forEach(([field, xPath]) => {
            const childNodes = xpath.select(xPath.split(parentXPath + '/')[1], node) as Node[];
            childNodes?.forEach((chNode) => {
                objectToSave[field] = chNode.textContent || '';
                if (chNode.nodeName === 'a') {
                    const hrefNode = xpath.select('@href', chNode) as Attr[];
                    if (hrefNode[0]) {
                        objectToSave.href = hrefNode[0].value;
                        objectToSave.id = objectToSave.href.split('/').filter(Boolean).join('-');
                    }
                }
            });
        });

        const safeRef = doc(
            db,
            `folders/${tokenId}/database/${sourceId}/data/${objectToSave.id || uuid()}`,
        );

        await setDoc(safeRef, objectToSave);
    });
};
