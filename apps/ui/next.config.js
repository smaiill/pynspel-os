/** @type {import('next').NextConfig} */
const path = require('path') // eslint-disable-line
const nextConfig = {
  compiler: {
    forceSwcTransforms: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.discordapp.com',
        port: '',
        pathname: '**/*',
      },
    ],
  },
}

module.exports = nextConfig
