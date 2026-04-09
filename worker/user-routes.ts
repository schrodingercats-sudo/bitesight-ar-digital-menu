import { Hono } from "hono";
import type { Env } from './core-utils';
import { MenuItemEntity, OrderEntity } from "./entities";
import { ok, bad, isStr } from './core-utils';
import type { OrderRequest, Order } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // MENU
  app.get('/api/menu', async (c) => {
    await MenuItemEntity.ensureSeed(c.env);
    const page = await MenuItemEntity.list(c.env, null, 100);
    return ok(c, page.items);
  });
  // ORDERS
  app.post('/api/orders', async (c) => {
    const body = (await c.req.json()) as OrderRequest;
    if (!body.items || body.items.length === 0) {
      return bad(c, 'Cart is empty');
    }
    if (!isStr(body.tableNumber)) {
      return bad(c, 'Table number is required');
    }
    const total = body.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const newOrder: Order = {
      id: crypto.randomUUID(),
      items: body.items,
      total,
      status: 'pending',
      tableNumber: body.tableNumber,
      timestamp: Date.now()
    };
    const created = await OrderEntity.create(c.env, newOrder);
    return ok(c, created);
  });
  app.get('/api/orders', async (c) => {
    const page = await OrderEntity.list(c.env, null, 50);
    return ok(c, page.items);
  });
}