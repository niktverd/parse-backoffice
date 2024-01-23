import type {NextApiRequest, NextApiResponse} from 'next';

import db from '../../../configs/firebase';
import {addSource, getSourceById, getSourcesList, updateSource} from '../../../src/api/sources';
import {DataBase} from '../../../src/types/api';

export default function handler(req: NextApiRequest, res: NextApiResponse<DataBase>) {
    if (req.method === 'GET' && !req.query.sourceId) {
        getSourcesList({db, req, res});
        return;
    }

    if (req.method === 'GET' && req.query.sourceId) {
        getSourceById({db, req, res});
        return;
    }

    if (req.method === 'POST') {
        addSource({db, req, res});
        return;
    }

    if (req.method === 'PATCH') {
        updateSource({db, req, res});
        return;
    }

    res.status(404).json({ok: false, message: 'Method not found'});
    return;
}
