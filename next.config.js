/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    env: {
        NEXT_PUBLIC_PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
};

module.exports = nextConfig;
