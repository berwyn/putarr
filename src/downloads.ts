import { createHono } from './utils.ts';
import { NewDownload } from './download.ts';
import { Data } from './data.ts';

export const app = createHono();

app.put('/add', async (c) => {
  const body = await c.req.parseBody<NewDownload>();

  const data = Data.getInstance();
  const download = data.addDownload(body);

  return c.json(download);
});

app.get('/status/:id', (c) => {
  const id = c.req.param().id;
  const data = Data.getInstance();

  const download = data.getById(id);

  return download == null ? c.notFound() : c.json(download);
});
