import { Hono } from "hono";
import type { Env } from './core-utils';
import { MenuItemEntity, OrderEntity } from "./entities";
import { ok, bad, isStr, notFound } from './core-utils';
import type { OrderRequest, Order, OrderStatus } from "@shared/types";
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // --- MENU ENDPOINTS ---
  app.get('/api/menu', async (c) => {
    try {
      await MenuItemEntity.ensureSeed(c.env);
      const result = await MenuItemEntity.list(c.env, null, 100);
      return ok(c, result.items);
    } catch (e) {
      console.error('[API ERROR] Failed to fetch menu:', e);
      return bad(c, 'Internal Server Error fetching menu');
    }
  });
  // --- ORDER ENDPOINTS ---
  app.post('/api/orders', async (c) => {
    try {
      const payload = (await c.req.json()) as OrderRequest;
      if (!payload.items || payload.items.length === 0) {
        return bad(c, 'Invalid order: Items required');
      }
      if (!isStr(payload.tableNumber)) {
        return bad(c, 'Invalid order: Table identifier required');
      }
      const orderTotal = payload.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const newOrder: Order = {
        id: crypto.randomUUID(),
        items: payload.items,
        total: orderTotal,
        status: 'pending',
        tableNumber: payload.tableNumber,
        timestamp: Date.now()
      };
      const result = await OrderEntity.create(c.env, newOrder);
      console.log(`[ORDER CREATED] ID: ${result.id} for ${result.tableNumber}`);
      return ok(c, result);
    } catch (e) {
      console.error('[API ERROR] Failed to create order:', e);
      return bad(c, 'Internal Server Error placing order');
    }
  });
  app.get('/api/orders', async (c) => {
    try {
      const result = await OrderEntity.list(c.env, null, 100);
      // Sort by recency (most recent first)
      const sortedItems = [...result.items].sort((a, b) => b.timestamp - a.timestamp);
      return ok(c, sortedItems);
    } catch (e) {
      console.error('[API ERROR] Failed to list orders:', e);
      return bad(c, 'Internal Server Error fetching orders');
    }
  });
  app.patch('/api/orders/:id', async (c) => {
    try {
      const orderId = c.req.param('id');
      const body = await c.req.json() as { status: OrderStatus };
      if (!body.status) {
        return bad(c, 'Status update value required');
      }
      const orderInstance = new OrderEntity(c.env, orderId);
      const exists = await orderInstance.exists();
      if (!exists) {
        return notFound(c, `Order ${orderId} not found`);
      }
      const updatedOrder = await orderInstance.mutate(currentState => ({
        ...currentState,
        status: body.status
      }));
      return ok(c, updatedOrder);
    } catch (e) {
      console.error('[API ERROR] Failed to update order status:', e);
      return bad(c, 'Internal Server Error updating order');
    }
  });
}