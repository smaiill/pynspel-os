/** @type {import('next').NextConfig} */
const path = require('path') // eslint-disable-line
const nextConfig = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'src/app')],
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
