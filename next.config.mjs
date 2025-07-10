/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    env: {
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        DEV_MODE: process.env.DEV_MODE
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
    webpack(config) {
      config.module.rules.push({
        test: /\.js$/, // Apply to all JS files
        exclude: /node_modules/, // Skip node_modules for speed
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: 'safari >= 15', // Target Safari 15.6.1 and up
                  useBuiltIns: 'usage', // Only include polyfills you need
                  corejs: 3, // Use core-js version 3 for polyfills
                },
              ],
            ],
          },
        },
      });
      return config;
    },
};

export default nextConfig;