import type {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../configs/firebase';
import {getSourceData} from '../../../src/api/data';
import {DataBase} from '../../../src/db/types';

export default function handler(req: NextApiRequest, res: NextApiResponse<DataBase>) {
    if (req.method === 'GET') {
        getSourceData({db, req, res});
        return;
    }

    res.status(404).json({ok: false, message: 'Method not found'});
    return;
}
