import type {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../configs/firebase';
import {createApiKey, disableApiKey, getApiKeyList} from '../../../src/api/api-keys';
import {DataBase} from '../../../src/types/api';

export default function handler(req: NextApiRequest, res: NextApiResponse<DataBase>) {
    if (req.method === 'GET') {
        getApiKeyList({db, req, res});
        return;
    }

    if (req.method === 'POST') {
        createApiKey({db, req, res});
        return;
    }

    if (req.method === 'PATCH') {
        disableApiKey({db, req, res});
        return;
    }

    res.status(404).json({ok: false, message: 'Method not found'});
    return;
}
