import {collection, doc, getDoc} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../configs/firebase';
import {Source} from '../../../src/business/types';
import {DataBase} from '../../../src/types/api';

async function getSourceById(req: NextApiRequest, res: NextApiResponse<DataBase<Source | null>>) {
    const {sourceId, userId: tokenId} = req.query as Partial<{
        [key: string]: string;
    }>;
    if (!sourceId) {
        res.status(404).json({ok: false, message: `Source ID was not provided`, data: null});
        return;
    }

    const guessCollectionRef = collection(db, 'projects');
    const guessDocRef = doc(guessCollectionRef, tokenId);
    const projectCollectionRef = doc(guessDocRef, 'sources', sourceId);
    const docSnap = await getDoc(projectCollectionRef);

    if (!docSnap.exists()) {
        res.status(404).json({
            ok: false,
            message: 'Source with given id is not found',
            data: null,
        });
        return;
    }

    res.json({
        ok: true,
        message: 'Success',
        data: docSnap.data() as Source,
    });
}

export default function handler(req: NextApiRequest, res: NextApiResponse<DataBase>) {
    if (req.method === 'GET' && req.query.sourceId && req.query.userId) {
        getSourceById(req, res);
        return;
    }

    res.status(404).json({ok: false, message: 'Method not found'});
    return;
}
