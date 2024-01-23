import {collection, doc, getDoc, setDoc} from 'firebase/firestore/lite';
import {getToken} from 'next-auth/jwt';
import type {NextApiRequest, NextApiResponse} from 'next/types';

import db from '../../configs/firebase';
import {Source} from '../types';
import {DataBase} from '../types/api';

const secret = process.env.NEXTAUTH_SECRET;

export const obtainToken = async (req: NextApiRequest, res: NextApiResponse<DataBase>) => {
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
    const guessCollectionRef = collection(db, 'sources');
    const guessDocRef = doc(guessCollectionRef, tokenId);
    const guessDoc = await getDoc(guessDocRef);
    if (!guessDoc.exists()) {
        await setDoc(guessDocRef, {userId: tokenId});
    }

    const updatedBody = {...source};

    const sourceRef = doc(guessDocRef, 'sources', source.data.id);
    await setDoc(sourceRef, updatedBody);

    return updatedBody;
};
