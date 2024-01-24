import {FirestoreAdapter as firestoreAdapter} from '@auth/firebase-adapter';
import {cert} from 'firebase-admin/app';
import yaml from 'js-yaml';
import {AuthOptions} from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
import github from 'next-auth/providers/github';
import googleProvider from 'next-auth/providers/google';

const firebasePrivateKey = yaml.load(process.env.FIREBASE_PRIVATE_KEY || 'value: ""') as {value: string};
// eslint-disable-next-line no-console
console.log(firebasePrivateKey);

export const authConfig: AuthOptions = {
    adapter: firestoreAdapter({
        credential: cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: firebasePrivateKey.value,
        }),
    }),
    providers: [
        googleProvider({
            clientId: process.env.AUTH_GOOGLE_CLIEN_ID as string,
            clientSecret: process.env.AUTH_GOOGLE_CLIEN_SECRET as string,
        }),
        github({
            clientId: process.env.AUTH_GITHUB_CLIEN_ID as string,
            clientSecret: process.env.AUTH_GITHUB_CLIEN_SECRET as string,
        }),

        // CredentialsProvider({})
    ],
    theme: {
        colorScheme: 'dark', // "auto" | "dark" | "light"
        brandColor: '#ff0000', // Hex color code
        logo: '', // Absolute URL to image
        buttonText: '#00ff00', // Hex color code
    },
    session: {
        strategy: 'jwt',
    },
};
