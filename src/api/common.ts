import {collection, doc, getDoc, setDoc} from 'firebase/firestore/lite';
import {getToken} from 'next-auth/jwt';
import type {NextApiRequest, NextApiResponse} from 'next/types';

import db from '../../configs/firebase';
import {dbEntities} from '../db/dbEntities';
import {ApiKey, Source} from '../db/models';
import {DataBase} from '../db/types';

const secret = process.env.NEXTAUTH_SECRET;

export const obtainToken = async (req: NextApiRequest, res: NextApiResponse<DataBase>) => {
    const authorizationHeader = req.headers['authorization'];

    if (authorizationHeader) {
        const apiKeyValue = authorizationHeader.split('Bearer ')[1];
        const apiKeysCollectionRef = collection(db, dbEntities.ApiKeys);
        const apiKeyDocRef = doc(apiKeysCollectionRef, apiKeyValue);
        const apiKeySnap = await getDoc(apiKeyDocRef);

        if (!apiKeySnap.exists()) {
            const errorMessage = 'You must provide an ApiKey.';
            res.status(401).json({ok: false, message: errorMessage});
            throw new Error(errorMessage);
        }

        const apiKeyData = apiKeySnap.data() as ApiKey;

        return apiKeyData.tokenId;
    }

    const token = await getToken({req, secret});
    if (!token?.sub) {
        const errorMessage = 'You must be logged in.';
        res.status(401).json({ok: false, message: errorMessage});
        throw new Error(errorMessage);
    }

    return token.sub || '';
};

export const obtainSource = async (req: NextApiRequest, res: NextApiResponse<DataBase>) => {
    const {body} = req;
    if (!body.sourceData?.id) {
        const errorMessage = 'Source ID is not provided';
        res.status(404).json({ok: false, message: errorMessage});

        throw new Error(errorMessage);
    }

    if (!('sourceData' in body)) {
        const errorMessage = 'Source Data is not provided';
        res.status(404).json({ok: false, message: errorMessage});

        throw new Error(errorMessage);
    }
    // if (!('viewConfigs' in body)) {
    //     const errorMessage = 'View Config is not provided';
    //     res.status(404).json({ok: false, message: errorMessage});

    //     throw new Error(errorMessage);
    // }

    return body;
};

export const writeSourceToDataBase = async ({
    source,
    tokenId,
}: {
    source: Source;
    tokenId: string;
}) => {
    const foldersCollectionRef = collection(db, dbEntities.Folders);
    const foldersDocRef = doc(foldersCollectionRef, tokenId);
    const foldersDoc = await getDoc(foldersDocRef);

    if (!foldersDoc.exists()) {
        await setDoc(foldersDocRef, {userId: tokenId});
    }

    const updatedBody = {...source, id: source.data.id};

    const sourceRef = doc(foldersDocRef, dbEntities.Sources, source.data.id);
    await setDoc(sourceRef, updatedBody);

    return updatedBody;
};
