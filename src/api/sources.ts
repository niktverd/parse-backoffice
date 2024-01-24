import {Firestore, collection, doc, getDoc, getDocs} from 'firebase/firestore/lite';
import type {NextApiRequest, NextApiResponse} from 'next';
import {uuid} from 'uuidv4';

import {initialSource} from '../../src/contexts/SourceContext';
import {DataBase} from '../../src/types/api';
import {deepCopy} from '../../src/utils/json';
import {Source} from '../types';

import {obtainToken, writeSourceToDataBase} from './common';

export type HandlerArgs<T> = {
    db: Firestore;
    req: NextApiRequest;
    res: NextApiResponse<DataBase<T>>;
};

export async function getSourcesList({req, res, db}: HandlerArgs<Source[]>) {
    const tokenId = await obtainToken(req, res);

    const guessCollectionRef = collection(db, 'sources');
    const sourceDocRef = doc(guessCollectionRef, tokenId);
    const sourceCollectionRef = collection(sourceDocRef, 'sources');
    const docSnaps = await getDocs(sourceCollectionRef);

    if (docSnaps.empty) {
        res.status(404).json({ok: false, message: 'Sources are not found', data: []});
        return;
    }

    res.json({
        ok: true,
        message: 'Success',
        data: docSnaps.docs.map((docEnt) => docEnt.data() as Source),
    });
}

export async function getSourceById({req, res, db}: HandlerArgs<Source | null>) {
    const tokenId = await obtainToken(req, res);
    const {sourceId} = req.query as Partial<{
        [key: string]: string;
    }>;
    if (!sourceId) {
        res.status(404).json({ok: false, message: `Source ID was not provided`, data: null});
        return;
    }

    const guessCollectionRef = collection(db, 'sources');
    const sourceDocRef = doc(guessCollectionRef, tokenId);
    const sourceCollectionRef = doc(sourceDocRef, 'sources', sourceId);
    const docSnap = await getDoc(sourceCollectionRef);

    if (!docSnap.exists()) {
        res.status(404).json({
            ok: false,
            message: 'Source with given id is not found',
            data: null,
        });
        return;
    }

    res.json({
        ok: true,
        message: 'Success',
        data: docSnap.data() as Source,
    });
}

export async function addSource({req, res}: HandlerArgs<Source>) {
    const tokenId = await obtainToken(req, res);

    if (!tokenId) {
        res.status(404).json({
            ok: false,
            message: 'tokenId is not provided',
        });

        return;
    }

    const source = deepCopy(initialSource) as Source;
    source.data.id = uuid();

    const savedSource = await writeSourceToDataBase({
        source,
        tokenId,
    });

    res.json({
        ok: true,
        message: 'Source created',
        data: savedSource,
    });
}
export async function updateSource({req, res}: HandlerArgs<Source>) {
    const tokenId = await obtainToken(req, res);

    const source = req.body.source as Source | undefined;

    if (!tokenId) {
        res.status(404).json({
            ok: false,
            message: 'tokenId is not provided',
        });

        return;
    }

    if (!source) {
        res.status(404).json({
            ok: false,
            message: 'source object is not provided',
        });

        return;
    }

    const savedSource = await writeSourceToDataBase({
        source,
        tokenId,
    });

    res.json({
        ok: true,
        message: 'Source updated',
        data: savedSource,
    });
}
