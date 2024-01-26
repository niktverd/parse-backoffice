/* eslint-disable no-console */
import axios from 'axios';
import {doc, getDoc} from 'firebase/firestore/lite';
import {DOMParser as Dom} from 'xmldom';
import xpath from 'xpath';

import db from '../../configs/firebase';
import {Source} from '../db/models';

type GetPageByUrlArgs = {
    url: string;
};

type CommonPartArgs = {
    strings: string[];
    currentIndex?: number;
    previousIndexLeft?: number;
    previousIndexRight?: number;
    shortestString?: string;
};

const commonPart = ({
    strings = [],
    currentIndex = 0,
    previousIndexLeft = 0,
    previousIndexRight = Infinity,
    shortestString = '',
}: CommonPartArgs): string => {
    let localShortestString = shortestString;

    if (!shortestString) {
        strings.sort((a, b) => b.length - a.length);
        localShortestString = strings[0] || '';
        return commonPart({
            strings,
            currentIndex: Math.round((localShortestString.length - 1) / 2),
            previousIndexLeft,
            previousIndexRight: localShortestString.length - 1,
            shortestString: localShortestString,
        });
    }

    const stem = localShortestString.slice(0, currentIndex);

    if (previousIndexLeft === previousIndexRight) {
        return stem;
    }

    const filtered = strings.filter((str) => str.includes(stem));

    if (filtered.length < strings.length) {
        return commonPart({
            strings,
            currentIndex: Math.floor((currentIndex + previousIndexLeft) / 2),
            previousIndexLeft,
            previousIndexRight: currentIndex - 1,
            shortestString: localShortestString,
        });
    } else {
        return commonPart({
            strings,
            currentIndex: Math.ceil((currentIndex + previousIndexRight) / 2),
            previousIndexLeft: currentIndex,
            previousIndexRight,
            shortestString: localShortestString,
        });
    }
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

    const xPaths = Object.values(config);
    let parentXPath = commonPart({strings: xPaths});
    const parentXPathFound = parentXPath;
    if (parentXPath.endsWith('/')) {
        parentXPath = parentXPath.replace(/\/$/, '');
    }

    const document = new Dom().parseFromString(data);
    const nodes = xpath.select(parentXPath, document);

    if (!nodes || !Array.isArray(nodes)) {
        return;
    }

    console.log(nodes.length);
    nodes.forEach((node) => {
        entries.forEach(([field, xPath]) => {
            console.log(entries, xPath, xPath.split(parentXPathFound)[1]);
            const childNodes = xpath.select(xPath.split(parentXPathFound)[1], node) as Node[];
            childNodes?.forEach((chNode) => {
                console.log(`\n\n\n\nfield: ${field}` + chNode.toString());
                console.log(chNode.nodeName);
                console.log(chNode.textContent);
            });
        });
    });

    console.log(config);
};
