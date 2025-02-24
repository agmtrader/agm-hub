/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        AGM_API_URL: process.env.AGM_API_URL,
        DEV_MODE: process.env.DEV_MODE,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
        FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
        FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
        FIREBASE_CONFIG_API_KEY: process.env.FIREBASE_CONFIG_API_KEY,
        FIREBASE_CONFIG_AUTH_DOMAIN: process.env.FIREBASE_CONFIG_AUTH_DOMAIN,
        FIREBASE_CONFIG_PROJECT_ID: process.env.FIREBASE_CONFIG_PROJECT_ID,
        FIREBASE_CONFIG_STORAGE_BUCKET: process.env.FIREBASE_CONFIG_STORAGE_BUCKET,
        FIREBASE_CONFIG_MESSAGING_SENDER_ID: process.env.FIREBASE_CONFIG_MESSAGING_SENDER_ID,
        FIREBASE_CONFIG_APP_ID: process.env.FIREBASE_CONFIG_APP_ID,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
                port: '',
                pathname: '**',
            },
        ],
    },
    output: 'standalone',
};

export default nextConfig;