import {Firestore, collection, doc, getDoc, setDoc} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';
import {uuid} from 'uuidv4';

import {DataBase} from '../types/api';
import {User} from '../types/user';

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
};

export async function getApiKeyList({req, res, db}: HandlerArgs<ApiKey[]>) {
    const tokenId = await obtainToken(req, res);

    const userCollectionRef = collection(db, 'users');
    const userDocRef = doc(userCollectionRef, tokenId);
    const docSnap = await getDoc(userDocRef);

    if (!docSnap.exists()) {
        res.status(404).json({ok: false, message: 'User is not found', data: []});
        return;
    }

    res.json({
        ok: true,
        message: 'Success',
        data: (docSnap.data() as User).apiKeys || [],
    });
}

export async function createApiKey({req, res, db}: HandlerArgs<ApiKey[]>) {
    const tokenId = await obtainToken(req, res);
    const {description = ''} = req.body as Pick<ApiKey, 'description'>;

    const userCollectionRef = collection(db, 'users');
    const userDocRef = doc(userCollectionRef, tokenId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        res.status(404).json({
            ok: false,
            message: 'User with given id is not found',
        });
        return;
    }

    const userData = userDocSnap.data() as User;
    if (!userData.apiKeys) {
        userData.apiKeys = [];
    }

    userData.apiKeys?.push({
        description,
        value: uuid(),
        isActive: true,
    });

    await setDoc(userDocRef, userData);

    await getApiKeyList({db, req, res});
}

export async function disableApiKey({req, res, db}: HandlerArgs<ApiKey[]>) {
    const tokenId = await obtainToken(req, res);
    const {value = ''} = req.body as Pick<ApiKey, 'value'>;

    const userCollectionRef = collection(db, 'users');
    const userDocRef = doc(userCollectionRef, tokenId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
        res.status(404).json({
            ok: false,
            message: 'User with given id is not found',
        });
        return;
    }

    const userData = userDocSnap.data() as User;
    if (!userData.apiKeys) {
        await getApiKeyList({db, req, res});
        return;
    }

    const apiKeys = userData.apiKeys.map((apiKey) => {
        return {
            ...apiKey,
            isActive: apiKey.value === value ? false : apiKey.value,
        };
    });

    await setDoc(userDocRef, {...userData, apiKeys});

    await getApiKeyList({db, req, res});
}
