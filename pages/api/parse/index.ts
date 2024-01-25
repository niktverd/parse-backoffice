import type {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../configs/firebase';
import {getPageByUrlApi} from '../../../src/api/parse';
import {DataBase} from '../../../src/db/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<DataBase>) {
    if (req.method === 'GET') {
        getPageByUrlApi({db, req, res});
        return;
    }

    res.status(404).json({ok: false, message: 'Method not found'});
    return;
}
