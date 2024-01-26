import {Firestore} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';

import {Source} from '../db/models';
import {DataBase} from '../db/types';
import {getPageByUrl} from '../parse';

export type HandlerArgs<T> = {
    db: Firestore;
    req: NextApiRequest;
    res: NextApiResponse<DataBase<T>>;
};

export async function getPageByUrlApi({res}: HandlerArgs<Source[]>) {
    getPageByUrl({url: 'https://boards.eu.greenhouse.io/abbyy'});

    res.json({
        ok: true,
        message: 'Success',
    });
}
