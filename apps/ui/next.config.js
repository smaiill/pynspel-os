/** @type {import('next').NextConfig} */
const path = require('path') // eslint-disable-line
const nextConfig = {
  compiler: {
    forceSwcTransforms: true,
  },
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
  productionBrowserSourceMaps: false,
  optimizeFonts: false,
  minify: false,
}

module.exports = nextConfig
