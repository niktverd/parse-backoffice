import React from 'react';

import {SessionProvider} from 'next-auth/react';
import type {AppProps} from 'next/app';

import '../styles/globals.scss';

export const APP_VERSION = 'v1.0.0';

function MyApp({Component, pageProps}: AppProps) {
    return (
        <SessionProvider>
            <Component {...pageProps} />
        </SessionProvider>
    );
}

export default MyApp;
