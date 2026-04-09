import { Hono } from "hono";
import type { Env } from './core-utils';
import { MenuItemEntity } from "./entities";
import { ok, bad } from './core-utils';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- MENU ENDPOINTS ---
  app.get('/api/menu', async (c) => {
    try {
      await MenuItemEntity.ensureSeed(c.env);
      const result = await MenuItemEntity.list(c.env, null, 100);
      return ok(c, result.items || []);
    } catch (e) {
      console.error('[API ERROR] Failed to fetch menu:', e);
      return bad(c, 'Internal Server Error fetching menu');
    }
  });
}