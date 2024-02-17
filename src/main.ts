import { logger } from 'hono/middleware.ts';

import { app as downloadApp } from './downloads.ts';
import { createHono } from './utils.ts';
import { Config } from './config.ts';
import { Watcher } from './watcher.ts';

const config = Config.getInstance();

const app = createHono();

app.use(logger());

// TODO: proper z-pages
app.get('/healthz', (c) => c.text('ok'));
app.get('/pingz', (c) => c.text('ok'));

app.route('/downloads', downloadApp);

app.notFound((c) => c.text(':('));

const server = Deno.serve({ port: config.port }, app.fetch);

const watcher = new Watcher();
config.watchDirectories.forEach(watcher.watch);

function shutdown() {
  server.shutdown();
  watcher.shutdown();
}

Deno.addSignalListener('SIGTERM', shutdown);
Deno.addSignalListener('SIGBREAK', shutdown);
Deno.addSignalListener('SIGINT', shutdown);
