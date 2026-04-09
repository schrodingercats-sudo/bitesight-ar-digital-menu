import { IndexedEntity } from "./core-utils";
import type { MenuItem, Order } from "@shared/types";
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
    glbUrl: "",
    dietaryTags: []
  };
  static seedData = [
    {
      id: 'm1',
      name: 'Artisan Avocado Toast',
      description: 'Freshly mashed avocado on sourdough with chili flakes, radish, and a poached egg. Perfectly balanced and nutritious.',
      price: 14.50,
      category: 'Starters',
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop',
      glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb',
      dietaryTags: ['Vegetarian', 'Healthy']
    },
    {
      id: 'm2',
      name: 'Truffle Wagyu Burger',
      description: 'Juicy Wagyu beef patty, black truffle aioli, aged cheddar, and caramelized onions on a toasted brioche bun.',
      price: 22.00,
      category: 'Mains',
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
      dietaryTags: ['Premium']
    },
    {
      id: 'm3',
      name: 'Wild Mushroom Risotto',
      description: 'Creamy Arborio rice with a medley of wild mushrooms, parmigiano reggiano, and a hint of truffle oil.',
      price: 18.50,
      category: 'Mains',
      imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?q=80&w=800&auto=format&fit=crop',
      dietaryTags: ['Vegetarian', 'Gluten-Free']
    },
    {
      id: 'm4',
      name: 'Burrata & Heirloom Tomato',
      description: 'Creamy burrata cheese with colorful heirloom tomatoes, fresh basil, and balsamic glaze reduction.',
      price: 16.00,
      category: 'Starters',
      imageUrl: 'https://images.unsplash.com/photo-1592417817098-8fd3d9eb14a5?q=80&w=800&auto=format&fit=crop',
      dietaryTags: ['Vegetarian']
    },
    {
      id: 'm5',
      name: 'Matcha Lava Cake',
      description: 'Warm matcha green tea cake with a molten chocolate center, served with vanilla bean gelato.',
      price: 12.00,
      category: 'Desserts',
      imageUrl: 'https://images.unsplash.com/photo-1547414368-ac9469279589?q=80&w=800&auto=format&fit=crop',
      dietaryTags: ['Vegetarian']
    }
  ];
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