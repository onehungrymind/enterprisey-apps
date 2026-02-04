import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import * as express from 'express';
import * as cors from 'cors';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import bootstrap from './bootstrap.server';

export function app(): express.Express {
  const server = express();
  const browserBundles = join(process.cwd(), 'dist/apps/ingress/browser');
  const serverBundles = join(process.cwd(), 'dist/apps/ingress/server');
  const indexHtml = existsSync(join(browserBundles, 'index.original.html'))
    ? join(browserBundles, 'index.original.html')
    : join(browserBundles, 'index.html');

  server.use(cors());

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserBundles);

  server.get('*.*', express.static(browserBundles, { maxAge: '1y' }));
  server.use('/server', express.static(serverBundles, { maxAge: '1y' }));

  server.get('*', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserBundles,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
    process.send && process.send('nx.server.ready');
  });
}

run();

export default bootstrap;
