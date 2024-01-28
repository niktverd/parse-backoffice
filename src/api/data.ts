import {Firestore, collection, getDocs} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';

import {DataBase} from '../db/types';

import {obtainToken} from './common';

export type HandlerArgs<T> = {
    db: Firestore;
    req: NextApiRequest;
    res: NextApiResponse<DataBase<T>>;
};

export async function getSourceData({db, req, res}: HandlerArgs<Record<string, string>[]>) {
    const tokenId = await obtainToken(req, res);

    if (!tokenId) {
        res.status(404).json({
            ok: false,
            message: 'tokenId is not provided',
        });

        return;
    }

    const sourceId = req.query.sourceId as string;

    if (!sourceId) {
        res.status(404).json({
            ok: false,
            message: 'sourceId is not provided',
        });

        return;
    }

    const collectionRef = collection(db, `folders/${tokenId}/database/${sourceId}/data`);
    const docSnaps = await getDocs(collectionRef);

    if (docSnaps.empty) {
        res.json({
            ok: true,
            message: 'Success empty',
            data: [],
        });
        return;
    }

    const data = docSnaps.docs.map((doc) => doc.data() as Record<string, string>);
    res.json({
        ok: true,
        message: 'Success',
        data,
    });
}
