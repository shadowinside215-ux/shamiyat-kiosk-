import { menuService } from './dbService';

const SEED_DATA = [
  {
    name: "Chicken Shawarma Wrap",
    description: "Authentic Damascus-style chicken shawarma with garlic sauce, pickles, and fries inside.",
    price: 45,
    category: "Shawarma",
    image: "https://images.unsplash.com/photo-1529006557870-174e506ca3b0?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Beef Shawarma Plate",
    description: "Tender beef strips served with tahini sauce, grilled tomatoes, onions, and parsley.",
    price: 65,
    category: "Shawarma",
    image: "https://images.unsplash.com/photo-1633383718081-22ac93e3dbf1?q=80&w=1931&auto=format&fit=crop",
  },
  {
    name: "Shish Tawook",
    description: "Grilled marinated chicken cubes served with garlic dip and fresh bread.",
    price: 75,
    category: "Grills",
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=1950&auto=format&fit=crop",
  },
  {
    name: "Kibbeh Meshwiyeh",
    description: "Traditional Syrian grilled kibbeh stuffed with meat, nuts, and pomegranate.",
    price: 85,
    category: "Grills",
    image: "https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=1170&auto=format&fit=crop",
  },
  {
    name: "Falafel Wrap",
    description: "Crispy falafel with tahini, tomatoes, pickles, and fresh mint in Syrian bread.",
    price: 35,
    category: "Sandwiches",
    image: "https://images.unsplash.com/photo-1547050605-2f3062335f6d?q=80&w=2070&auto=format&fit=crop",
  },
  {
    name: "Hummus with Pita",
    description: "Creamy chickpea dip topped with olive oil and paprika, served with warm bread.",
    price: 40,
    category: "Sides",
    image: "https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?q=80&w=2072&auto=format&fit=crop",
  },
  {
    name: "Baklava Assortment",
    description: "Layers of phyllo pastry filled with chopped nuts and sweetened with syrup.",
    price: 55,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1519676867240-f03562e64548?q=80&w=2069&auto=format&fit=crop",
  },
  {
    name: "Kunafa",
    description: "Warm cheese pastry soaked in sweet syrup and topped with pistachios.",
    price: 60,
    category: "Desserts",
    image: "https://images.unsplash.com/photo-1627310461621-e35b7e289f6e?q=80&w=1171&auto=format&fit=crop",
  },
  {
    name: "Mint Lemonade",
    description: "Refreshing frozen lemonade blended with fresh mint leaves.",
    price: 30,
    category: "Drinks",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1974&auto=format&fit=crop",
  }
];

export const seedMenu = async () => {
  const existing = await menuService.getAll();
  if (existing.length === 0) {
    console.log("Seeding menu...");
    for (const item of SEED_DATA) {
      await menuService.add(item as any);
    }
    return true;
  }
  return false;
};
