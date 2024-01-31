import {Firestore} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';

import {DataBase} from '../db/types';
import {getFromBackoffice, getPageByUrl} from '../parse';

export type HandlerArgs<T> = {
    db: Firestore;
    req: NextApiRequest;
    res: NextApiResponse<DataBase<T>>;
};

export async function getPageByUrlApi({res}: HandlerArgs<{}>) {
    getPageByUrl();

    res.json({
        ok: true,
        message: 'Success',
    });
}

export async function getFromBackofficeApi({req, res}: HandlerArgs<{}>) {
    getFromBackoffice({req, res});
}
