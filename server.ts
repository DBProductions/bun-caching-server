import { Database } from './database';
import { Cache } from './cache';
import { Service } from './service';
import { Controller } from './controller';

const db = new Database({
  connectionString: process.env.DATABASE_URL || 'postgres://bun:bun@localhost:5432/bun'
});

const cache = new Cache({
  redisUrl: process.env.REDIS_URL || 'redis://:secret_password@localhost:6379',
  defaultTtl: 36000,
  connectionTimeout: 3000,
  maxRetries: 3
});

const service = new Service(db, cache);
const controller = new Controller(service);

const server = Bun.serve({
  port: parseInt(process.env.PORT || '3000', 10),
  idleTimeout: 2,
  routes: {
    "/users/:id": {
      GET: async (req) => await controller.getData(req.params.id) as Response,
      PATCH: async (req) => {
        const headers = req.headers;
        const id = req.params.id;
        let body;
        try {
          body = await req.json();
        } catch (e) {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        return await controller.updateData(headers, id, body);
      },
      PUT: async (req) => {
        const headers = req.headers;
        const id = req.params.id;
        let body;
        try {
          body = await req.json();
        } catch (e) {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        return await controller.replaceData(headers, id, body);
      },
      DELETE: async (req) => {
        const id = req.params.id;
        return await controller.deleteData(id);
      },
    },
    "/users": {
      POST: async (req) => {
        const headers = req.headers;
        let body;
        try {
          body = await req.json();
        } catch (e) {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        return await controller.createData(headers, body);
      }
    },
    "/health": {
      GET: async () => {
        let status = 200;
        const error: string[] = [];
        const responseBody: { status?: string; timestamp: string; error?: string[] } = { status: 'ok', timestamp: new Date().toISOString() };
        if (!await cache.check()) {
          status = 500;
          error.push('cache is down');
        }
        if (!await db.check()) {
          status = 500;
          error.push('database is down');
        }
        if (error.length !== 0) {
          delete responseBody.status;
          responseBody.error = error;
        }
        return Response.json(responseBody, { status });
      },
    }
  }
});

console.log(`Listening on ${server.url}`);
