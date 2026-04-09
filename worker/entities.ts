import { IndexedEntity } from "./core-utils";
import type { MenuItem, Order } from "@shared/types";
import { MOCK_MENU_ITEMS } from "@shared/mock-data";
export class MenuItemEntity extends IndexedEntity<MenuItem> {
  static readonly entityName = "menu-item";
  static readonly indexName = "menu-items";
  static readonly initialState: MenuItem = {
    id: "",
    name: "",
    description: "",
    price: 0,
    category: "",
    imageUrl: "",
    dietaryTags: []
  };
  static seedData = MOCK_MENU_ITEMS;
}
export class OrderEntity extends IndexedEntity<Order> {
  static readonly entityName = "order";
  static readonly indexName = "orders";
  static readonly initialState: Order = {
    id: "",
    items: [],
    total: 0,
    status: 'pending',
    tableNumber: "",
    timestamp: 0
  };
}