/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    swcMinify: true,
    compiler: {
        styledComponents: true
    },
    async rewrites() {
        return [
            {
                source: '/product/:id',
                destination: '/product/[id]',
            },
            {
                source: '/category/:id',
                destination: '/category/[id]',
            },
        ];
    }
}

module.exports = nextConfig
