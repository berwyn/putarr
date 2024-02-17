import { Hono } from 'hono/mod.ts';
import { cors } from 'hono/middleware.ts';

export function createHono() {
  const app = new Hono();

  app.use(cors());

  return app;
}

export function notNull<T>(value: T | undefined | null): value is T {
  return value != null;
}
