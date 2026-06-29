import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import jwt from 'jsonwebtoken';
import { kv } from '@vercel/kv';
import bootstrap from './src/main.server';

const JWT_SECRET = process.env['JWT_SECRET'] || 'dev-secret-change-me';
const ADMIN_USER  = process.env['ADMIN_USERNAME'] || 'admin';
const ADMIN_PASS  = process.env['ADMIN_PASSWORD'] || 'skyline2024';
const IS_VERCEL   = !!process.env['KV_REST_API_URL'];

function requireAuth(req: express.Request, res: express.Response, next: express.NextFunction): void {
  const auth  = req.headers['authorization'] ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
  try {
    jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'No autorizado' });
  }
}

export function app(): express.Express {
  const server = express();
  const serverDistFolder  = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml         = join(serverDistFolder, 'index.server.html');
  const statusFile        = resolve(serverDistFolder, '../../../viviendas-status.json');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);
  server.use(express.json());

  // ── API: autenticación ────────────────────────────────────────────────────
  server.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body ?? {};
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      const token = jwt.sign({ sub: 'admin' }, JWT_SECRET, { expiresIn: '8h' });
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Credenciales incorrectas' });
    }
  });

  // ── API: leer estados ─────────────────────────────────────────────────────
  server.get('/api/viviendas/status', async (_req, res) => {
    try {
      if (IS_VERCEL) {
        const data = await kv.get<Record<string, number>>('viviendas-status') ?? {};
        res.json(data);
      } else {
        if (!existsSync(statusFile)) { res.json({}); return; }
        res.json(JSON.parse(readFileSync(statusFile, 'utf-8')));
      }
    } catch {
      res.json({});
    }
  });

  // ── API: actualizar estado ────────────────────────────────────────────────
  server.put('/api/viviendas/:ficha/status', requireAuth, async (req, res) => {
    const { ficha }  = req.params;
    const { status } = req.body ?? {};
    if (status !== 0 && status !== 1 && status !== 2) {
      res.status(400).json({ error: 'Estado inválido' }); return;
    }
    try {
      if (IS_VERCEL) {
        const current = await kv.get<Record<string, number>>('viviendas-status') ?? {};
        current[ficha] = status;
        await kv.set('viviendas-status', current);
      } else {
        let data: Record<string, number> = {};
        if (existsSync(statusFile)) {
          try { data = JSON.parse(readFileSync(statusFile, 'utf-8')); } catch { /* */ }
        }
        data[ficha] = status;
        writeFileSync(statusFile, JSON.stringify(data, null, 2), 'utf-8');
      }
      res.json({ ok: true });
    } catch {
      res.status(500).json({ error: 'Error guardando estado' });
    }
  });

  // ── Archivos estáticos ────────────────────────────────────────────────────
  server.get('**', express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }));

  // ── Angular SSR ───────────────────────────────────────────────────────────
  server.get('**', (req, res, next) => {
    const { protocol, originalUrl, baseUrl, headers } = req;
    commonEngine
      .render({
        bootstrap,
        documentFilePath: indexHtml,
        url: `${protocol}://${headers.host}${originalUrl}`,
        publicPath: browserDistFolder,
        providers: [{ provide: APP_BASE_HREF, useValue: baseUrl }],
      })
      .then(html => res.send(html))
      .catch(err => next(err));
  });

  return server;
}

// Instancia única compartida entre local y Vercel
const expressApp = app();

// Export para Vercel serverless (importa el módulo, no lo ejecuta)
export default expressApp;

// Arrancar HTTP server solo en local
if (!process.env['VERCEL']) {
  const port = process.env['PORT'] || 4000;
  expressApp.listen(port, () => {
    console.log(`✅  SSR server → http://localhost:${port}`);
  });
}
