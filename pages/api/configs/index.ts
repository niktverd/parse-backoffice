import {collection, doc, getDoc} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../configs/firebase';
import {obtainSource, obtainToken, writeSourceToDataBase} from '../../../src/api/common';
import {dbEntities} from '../../../src/db/dbEntities';
import {Source} from '../../../src/db/models';
import {DataBase} from '../../../src/db/types';

async function saveConfig(req: NextApiRequest, res: NextApiResponse<DataBase>) {
    const tokenId = await obtainToken(req, res);

    if (!tokenId) {
        res.status(404).json({
            ok: false,
            message: 'tokenId is not provided',
        });

        return;
    }

    const source = await obtainSource(req, res);

    await writeSourceToDataBase({
        source,
        tokenId,
    });

    res.json({
        ok: true,
        message: 'Success',
    });
    return;
}

async function getConfig(req: NextApiRequest, res: NextApiResponse<DataBase<Source>>) {
    const tokenId = await obtainToken(req, res);
    const {sourceId} = req.query as Partial<{[key: string]: string}>;
    if (!sourceId) {
        res.status(404).json({ok: false, message: 'Source ID is not provided'});
        return;
    }

    const folderCollectionRef = collection(db, dbEntities.Folders);
    const sourceDocRef = doc(folderCollectionRef, tokenId);
    const sourceRef = doc(sourceDocRef, dbEntities.Sources, sourceId);
    const docSnap = await getDoc(sourceRef);

    if (!docSnap.exists()) {
        res.status(404).json({ok: false, message: 'Record is not found'});
        return;
    }

    res.json({
        ok: true,
        message: 'Success',
        data: docSnap.data() as Source,
    });
}

export default function handler(req: NextApiRequest, res: NextApiResponse<DataBase>) {
    if (req.method === 'POST') {
        saveConfig(req, res);
        return;
    }

    if (req.method === 'GET') {
        getConfig(req, res);
        return;
    }

    res.status(404).json({ok: false, message: 'not found'});
    return;
}
