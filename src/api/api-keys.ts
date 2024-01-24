import {
    Firestore,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
} from 'firebase/firestore/lite';
import {omit} from 'lodash';
import type {NextApiRequest, NextApiResponse} from 'next';
import {uuid} from 'uuidv4';

import {DataBase} from '../types/api';

import {obtainToken} from './common';

export type HandlerArgs<T> = {
    db: Firestore;
    req: NextApiRequest;
    res: NextApiResponse<DataBase<T>>;
};

export type ApiKey = {
    value: string;
    description: string;
    isActive: boolean;
    tokenId?: string;
};

export async function getApiKeyList({req, res, db}: HandlerArgs<ApiKey[]>) {
    const tokenId = await obtainToken(req, res);

    const apiKeyCollectionRef = collection(db, 'api-keys');
    const q = query(apiKeyCollectionRef, where('tokenId', '==', tokenId));
    const apiKeyDocsSnap = await getDocs(q);

    if (apiKeyDocsSnap.empty) {
        res.status(404).json({ok: false, message: 'ApiKeys are not found', data: []});
        return;
    }

    res.json({
        ok: true,
        message: 'Success1',
        data: apiKeyDocsSnap.docs.map((docSnap) => omit(docSnap.data() as ApiKey, 'tokenId')) || [],
    });
}

export async function createApiKey({req, res, db}: HandlerArgs<ApiKey[]>) {
    const tokenId = await obtainToken(req, res);
    const {description = ''} = req.body as Pick<ApiKey, 'description'>;
    const value = uuid();

    const apiKeyCollectionRef = collection(db, 'api-keys');
    const apiKeyDocRef = doc(apiKeyCollectionRef, value);
    const apiKeyDocSnap = await getDoc(apiKeyDocRef);

    if (apiKeyDocSnap.exists()) {
        res.status(404).json({
            ok: false,
            message: 'ApiKey is already exists',
        });
        return;
    }

    await setDoc(apiKeyDocRef, {
        description,
        value,
        tokenId,
        isActive: true,
    });

    await getApiKeyList({db, req, res});
}

export async function disableApiKey({req, res, db}: HandlerArgs<ApiKey[]>) {
    const tokenId = await obtainToken(req, res);
    const {value = ''} = req.body as Pick<ApiKey, 'value'>;

    const apiKeyCollectionRef = collection(db, 'api-keys');
    const apiKeyDocRef = doc(apiKeyCollectionRef, value);
    const apiKeyDocSnap = await getDoc(apiKeyDocRef);

    if (!apiKeyDocSnap.exists()) {
        res.status(404).json({
            ok: false,
            message: 'ApiKey with given id is not found',
        });

        return;
    }

    const apiKeyData = apiKeyDocSnap.data() as ApiKey;

    if (apiKeyData.tokenId !== tokenId) {
        res.status(401).json({
            ok: false,
            message: 'You have no right to manage this apiKey',
        });

        return;
    }

    await setDoc(apiKeyDocRef, {...apiKeyData, isActive: false});

    await getApiKeyList({db, req, res});
}
