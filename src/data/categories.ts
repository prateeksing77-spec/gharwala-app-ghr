import { Category } from '@/types';

export const categorySections = [
  { id: 'grocery', name: 'Grocery & Kitchen', icon: 'ShoppingBasket' },
  { id: 'snacks', name: 'Snacks & Drinks', icon: 'Coffee' },
  { id: 'local', name: 'Local Specials', icon: 'Star', isGold: true },
  { id: 'beauty', name: 'Beauty & Personal Care', icon: 'Sparkles' },
  { id: 'household', name: 'Household', icon: 'Home' },
];

export const categories: Category[] = [
  { id: 'vegetables-fruits', name: 'Vegetables & Fruits', icon: 'Apple', section: 'grocery', subcategories: ['Fresh Vegetables', 'Fresh Fruits', 'Exotic Fruits', 'Herbs & Seasonings'] },
  { id: 'atta-rice-dal', name: 'Atta Rice & Dal', icon: 'Wheat', section: 'grocery', subcategories: ['Atta & Flour', 'Rice', 'Dal & Pulses'] },
  { id: 'oil-ghee-masala', name: 'Oil Ghee & Masala', icon: 'Flame', section: 'grocery', subcategories: ['Cooking Oil', 'Ghee', 'Masala & Spices'] },
  { id: 'dairy-bread-eggs', name: 'Dairy Bread & Eggs', icon: 'Egg', section: 'grocery', subcategories: ['Milk', 'Curd & Paneer', 'Bread', 'Eggs'] },
  { id: 'bakery-biscuits', name: 'Bakery & Biscuits', icon: 'Cookie', section: 'grocery', subcategories: ['Biscuits', 'Cakes', 'Rusks'] },
  { id: 'dry-fruits-cereals', name: 'Dry Fruits & Cereals', icon: 'Nut', section: 'grocery', subcategories: ['Dry Fruits', 'Muesli', 'Oats', 'Cornflakes'] },
  { id: 'spices', name: 'Spices', icon: 'Leaf', section: 'grocery', subcategories: ['Whole Spices', 'Ground Spices', 'Blended Masala'] },
  { id: 'kitchen-essentials', name: 'Kitchen Essentials', icon: 'ChefHat', section: 'grocery', subcategories: ['Salt & Sugar', 'Vinegar', 'Food Colors'] },

  { id: 'chips-namkeen', name: 'Chips & Namkeen', icon: 'Popcorn', section: 'snacks', subcategories: ['Chips', 'Namkeen', 'Papad'] },
  { id: 'sweets-chocolates', name: 'Sweets & Chocolates', icon: 'Candy', section: 'snacks', subcategories: ['Chocolates', 'Toffees', 'Indian Sweets'] },
  { id: 'drinks-juices', name: 'Drinks & Juices', icon: 'GlassWater', section: 'snacks', subcategories: ['Soft Drinks', 'Juices', 'Water'] },
  { id: 'tea-coffee', name: 'Tea Coffee', icon: 'Coffee', section: 'snacks', subcategories: ['Tea', 'Coffee', 'Green Tea'] },
  { id: 'instant-food', name: 'Instant Food', icon: 'Zap', section: 'snacks', subcategories: ['Noodles', 'Pasta', 'Ready to Eat'] },
  { id: 'sauces', name: 'Sauces', icon: 'Droplets', section: 'snacks', subcategories: ['Ketchup', 'Soy Sauce', 'Chutney'] },
  { id: 'ice-creams', name: 'Ice Creams', icon: 'IceCreamCone', section: 'snacks', subcategories: ['Cones', 'Cups', 'Family Packs'] },
  { id: 'paan-corner', name: 'Paan Corner', icon: 'Leaf', section: 'snacks', subcategories: ['Mouth Freshener', 'Supari', 'Paan'] },

  { id: 'desi-ghee-oils', name: 'Desi Ghee & Oils', icon: 'Droplets', section: 'local', subcategories: ['Pure Desi Ghee', 'Mustard Oil', 'Cold Pressed'] },
  { id: 'farm-fresh', name: 'Farm Fresh', icon: 'Sprout', section: 'local', subcategories: ['Farm Vegetables', 'Farm Fruits', 'Organic'] },
  { id: 'homemade-pickles', name: 'Homemade Pickles', icon: 'Jar', section: 'local', subcategories: ['Mango', 'Mixed', 'Lemon', 'Chilli'] },
  { id: 'local-dairy', name: 'Local Dairy', icon: 'MilkOff', section: 'local', subcategories: ['Fresh Milk', 'Dahi', 'Makhan', 'Lassi'] },
  { id: 'desi-masale', name: 'Desi Masale', icon: 'Flame', section: 'local', subcategories: ['Homemade', 'Stone Ground', 'Traditional'] },
  { id: 'sattu-traditional', name: 'Sattu & Traditional', icon: 'Wheat', section: 'local', subcategories: ['Sattu', 'Chura', 'Litti'] },
  { id: 'festival-essentials', name: 'Festival Essentials', icon: 'Sparkles', section: 'local', subcategories: ['Puja Items', 'Decorations', 'Sweets'] },
  { id: 'regional-sweets', name: 'Regional Sweets', icon: 'Cake', section: 'local', subcategories: ['Laddu', 'Peda', 'Barfi', 'Rasgulla'] },

  { id: 'bath-body', name: 'Bath & Body', icon: 'Bath', section: 'beauty', subcategories: ['Soap', 'Body Wash', 'Lotion'] },
  { id: 'hair', name: 'Hair', icon: 'Scissors', section: 'beauty', subcategories: ['Shampoo', 'Oil', 'Conditioner'] },
  { id: 'skin-face', name: 'Skin & Face', icon: 'Sparkle', section: 'beauty', subcategories: ['Face Wash', 'Cream', 'Sunscreen'] },
  { id: 'baby-care', name: 'Baby Care', icon: 'Baby', section: 'beauty', subcategories: ['Diapers', 'Wipes', 'Baby Food'] },

  { id: 'home-lifestyle', name: 'Home Lifestyle', icon: 'Lamp', section: 'household', subcategories: ['Decor', 'Storage', 'Kitchen Tools'] },
  { id: 'cleaners', name: 'Cleaners', icon: 'SprayCanIcon', section: 'household', subcategories: ['Floor', 'Toilet', 'Kitchen'] },
  { id: 'electronics', name: 'Electronics', icon: 'Plug', section: 'household', subcategories: ['Batteries', 'Bulbs', 'Cables'] },
  { id: 'stationery', name: 'Stationery', icon: 'PenTool', section: 'household', subcategories: ['Pens', 'Notebooks', 'Tape'] },
];
