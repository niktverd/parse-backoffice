/* eslint-disable no-console */
import axios from 'axios';
import {doc, getDoc, setDoc} from 'firebase/firestore/lite';
import {DOMParser as Dom} from 'xmldom';
import xpath from 'xpath';

import db from '../../configs/firebase';
import {Source} from '../db/models';

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
        'folders/Cp3YffurrZEdlrWzs02X/sources/6dbd3c07-c16d-49d6-ab2d-af201cfa7d05',
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
    console.log('\n\n', parentXPath, '\n\n');

    if (!parentXPath) {
        return;
    }
    const document = new Dom().parseFromString(data);
    const nodes = xpath.select(parentXPath, document);

    if (!nodes || !Array.isArray(nodes)) {
        return;
    }

    console.log(nodes.length);
    nodes.forEach(async (node) => {
        const objectToSave: Record<string, string> = {};
        childrenXpaths.forEach(([field, xPath]) => {
            const childNodes = xpath.select(xPath.split(parentXPath + '/')[1], node) as Node[];
            childNodes?.forEach((chNode) => {
                objectToSave[field] = chNode.textContent || '';
                if (chNode.nodeName === 'a') {
                    const hrefNode = xpath.select('@href', chNode) as Attr[];
                    // console.log(hrefNode);
                    if (hrefNode[0]) {
                        objectToSave.href = hrefNode[0].value;
                        objectToSave.id = objectToSave.href.split('/').filter(Boolean).join('-');
                    }
                }
            });
        });
    
        const safeRef = doc(
            db,
            'folders/Cp3YffurrZEdlrWzs02X/database/' + objectToSave.id,
        );
    
        await setDoc(safeRef, objectToSave);
    });

    console.log(config);
};
