const { NxWebpackPlugin } = require('@nx/webpack');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../../dist/apis/transformation'),
  },
  plugins: [
    new NxWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: false,
      outputHashing: 'none',
      externalDependencies: [
        'pg',
        'pg-native',
        'better-sqlite3',
        'bindings',
        '@nestjs/websockets',
        '@nestjs/websockets/socket-module',
        '@nestjs/microservices',
        '@nestjs/microservices/microservices-module',
        'class-transformer/storage',
      ],
    }),
  ],
};
