import React, {SetStateAction, useState} from 'react';

import {SessionProvider} from 'next-auth/react';
import type {AppProps} from 'next/app';

import {Source} from '../src/db/models';
import {SourceContext, initialSource} from '../src/ui/contexts/SourceContext';
import useStorage from '../src/ui/hooks/useStorage';

import '../styles/globals.scss';

export const APP_VERSION = 'v1.0.0';

function MyApp({Component, pageProps}: AppProps) {
    const {getItem, setItem} = useStorage();
    const savedSource = JSON.parse((getItem('source', 'local') || '{}') as string);
    const ssdKeys = Object.keys(savedSource);
    const [source, setSource] = useState<Source>(ssdKeys.length ? savedSource : initialSource);
    const setSourceUpdated: React.Dispatch<React.SetStateAction<Source>> = (
        sd: SetStateAction<Source>,
    ) => {
        setSource(sd);
        setItem('source', JSON.stringify(sd), 'local');
    };

    return (
        <SessionProvider>
            <SourceContext.Provider value={{source, setSource: setSourceUpdated}}>
                <Component {...pageProps} />
            </SourceContext.Provider>
        </SessionProvider>
    );
}

export default MyApp;
