
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'images.unsplash.com',
//       },
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '8000',
//         pathname: '/media/**',
//       },
//     ],
//     // ✅ This is the fix — allows localhost/private IPs for image optimization
//     dangerouslyAllowSVG: true,
//     unoptimized: process.env.NODE_ENV === 'development',
//   },
// };

// module.exports = nextConfig;


/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      // ✅ Local Development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      // ✅ Production Backend (Render)
      {
        protocol: 'https',
        hostname: 'dating-platform-backend.onrender.com',
        pathname: '/media/**', 
      },
    ],
    dangerouslyAllowSVG: true,
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

module.exports = nextConfig;