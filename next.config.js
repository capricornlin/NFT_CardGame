/** @type {import('next').NextConfig} */
// const withCSS = require('@zeit/next-css');
// const compose = require('next-compose');
// cssConfig = {};
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

// config.module.rules.push({
//   test: /\.(mp3)$/,
//   use: {
//     loader: 'file-loader',
//     options: {
//       publicPath: '/_next/static/sounds/',
//       outputPath: 'static/sounds/',
//       name: '[name].[ext]',
//       esModule: false,
//     },
//   },
// });

// module.exports = compose([
//   [withCSS, cssConfig],
//   {
//     webpack(config, options) {
//       config.module.rules.push({
//         test: /\.mp3$/,
//         use: {
//           loader: 'file-loader',
//         },
//       });
//       return config;
//     },
//   },
// ]);

module.exports = nextConfig;
