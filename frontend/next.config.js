/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'res.cloudinary.com',
                pathname: '**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                pathname: '**',
            }
        ],
    },
    async rewrites() {
        return [
          {
            source: '/api/:path*',
            destination: 'https://sachin-dev-59j2.onrender.com/api/:path*', // Proxy to Backend
          },
        ]
      },
}

module.exports = nextConfig
