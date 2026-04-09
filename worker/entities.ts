import { IndexedEntity } from "./core-utils";
import type { MenuItem } from "@shared/types";
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
      description: 'Freshly mashed avocado on sourdough with chili flakes, radish, and a poached egg. A masterpiece of healthy textures.',
      price: 14.50,
      category: 'Starters',
      imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?q=80&w=800&auto=format&fit=crop',
      glbUrl: 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb',
      dietaryTags: ['Vegetarian', 'Healthy', 'AR Ready']
    },
    {
      id: 'm2',
      name: 'Grande Beef Burrito',
      description: 'Slow-cooked seasoned beef, lime-cilantro rice, black beans, and fresh pico de gallo wrapped in a toasted flour tortilla.',
      price: 18.00,
      category: 'Mains',
      imageUrl: 'https://images.unsplash.com/photo-1574484284002-952d92456975?q=80&w=800&auto=format&fit=crop',
      glbUrl: 'https://hrdlmntptsiaswkxozlg.supabase.co/storage/v1/object/public/models/burrito.glb',
      dietaryTags: ['Filling', 'Protein Rich']
    },
    {
      id: 'm3',
      name: 'Traditional Meat Lasagna',
      description: 'Layers of rich bolognese sauce, creamy béchamel, and silky pasta sheets topped with melted mozzarella and parmesan.',
      price: 21.50,
      category: 'Mains',
      imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?q=80&w=800&auto=format&fit=crop',
      glbUrl: 'https://hrdlmntptsiaswkxozlg.supabase.co/storage/v1/object/public/models/lasagna.glb',
      dietaryTags: ['Comfort Food', 'Classic']
    },
    {
      id: 'm4',
      name: 'Flame-Grilled Meat Skewers',
      description: 'Tender marinated meat cubes grilled over open flames, served with a zesty herb dipping sauce and charred lemon.',
      price: 16.50,
      category: 'Starters',
      imageUrl: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=800&auto=format&fit=crop',
      glbUrl: 'https://hrdlmntptsiaswkxozlg.supabase.co/storage/v1/object/public/models/meat_skewer.glb',
      dietaryTags: ['Grilled', 'Keto-Friendly']
    },
    {
      id: 'm6',
      name: 'Golden Chicken Nuggets',
      description: 'Crispy, breaded chicken breast pieces fried to golden perfection. Served with our signature honey mustard sauce.',
      price: 9.50,
      category: 'Sides',
      imageUrl: 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=800&auto=format&fit=crop',
      glbUrl: 'https://hrdlmntptsiaswkxozlg.supabase.co/storage/v1/object/public/models/chicken_nugget.glb',
      dietaryTags: ['Kids Choice', 'Crispy']
    }
  ];
}