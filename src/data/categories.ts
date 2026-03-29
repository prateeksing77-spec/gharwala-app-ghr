import { Category } from '@/types';

export const categorySections = [
  { id: 'grocery', name: 'Grocery & Kitchen', icon: 'ShoppingBasket' },
  { id: 'snacks', name: 'Snacks & Drinks', icon: 'Coffee' },
  { id: 'local', name: 'Local Specials', icon: 'Star', isGold: true },
  { id: 'beauty', name: 'Beauty & Personal Care', icon: 'Sparkles' },
  { id: 'household', name: 'Household', icon: 'Home' },
];

export const categories: Category[] = [
  { id: 'vegetables-fruits', name: 'Vegetables & Fruits', icon: 'Apple', section: 'grocery', subcategories: ['Fresh Vegetables', 'Fresh Fruits', 'Exotic Fruits', 'Herbs & Seasonings'], image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200' },
  { id: 'atta-rice-dal', name: 'Atta Rice & Dal', icon: 'Wheat', section: 'grocery', subcategories: ['Atta & Flour', 'Rice', 'Dal & Pulses'], image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200' },
  { id: 'oil-ghee-masala', name: 'Oil Ghee & Masala', icon: 'Flame', section: 'grocery', subcategories: ['Cooking Oil', 'Ghee', 'Masala & Spices'], image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200' },
  { id: 'dairy-bread-eggs', name: 'Dairy Bread & Eggs', icon: 'Egg', section: 'grocery', subcategories: ['Milk', 'Curd & Paneer', 'Bread', 'Eggs'], image: 'https://images.unsplash.com/photo-1628088062854-d1870b4553da?w=200' },
  { id: 'bakery-biscuits', name: 'Bakery & Biscuits', icon: 'Cookie', section: 'grocery', subcategories: ['Biscuits', 'Cakes', 'Rusks'], image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200' },
  { id: 'dry-fruits-cereals', name: 'Dry Fruits & Cereals', icon: 'Nut', section: 'grocery', subcategories: ['Dry Fruits', 'Muesli', 'Oats', 'Cornflakes'], image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=200' },
  { id: 'spices', name: 'Spices', icon: 'Leaf', section: 'grocery', subcategories: ['Whole Spices', 'Ground Spices', 'Blended Masala'], image: 'https://images.unsplash.com/photo-1596547609652-9cf5d8d76921?w=200' },
  { id: 'kitchen-essentials', name: 'Kitchen Essentials', icon: 'ChefHat', section: 'grocery', subcategories: ['Salt & Sugar', 'Vinegar', 'Food Colors'], image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=200' },

  { id: 'chips-namkeen', name: 'Chips & Namkeen', icon: 'Popcorn', section: 'snacks', subcategories: ['Chips', 'Namkeen', 'Papad'], image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=200' },
  { id: 'sweets-chocolates', name: 'Sweets & Chocolates', icon: 'Candy', section: 'snacks', subcategories: ['Chocolates', 'Toffees', 'Indian Sweets'], image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200' },
  { id: 'drinks-juices', name: 'Drinks & Juices', icon: 'GlassWater', section: 'snacks', subcategories: ['Soft Drinks', 'Juices', 'Water'], image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=200' },
  { id: 'tea-coffee', name: 'Tea Coffee', icon: 'Coffee', section: 'snacks', subcategories: ['Tea', 'Coffee', 'Green Tea'], image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200' },
  { id: 'instant-food', name: 'Instant Food', icon: 'Zap', section: 'snacks', subcategories: ['Noodles', 'Pasta', 'Ready to Eat'], image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200' },
  { id: 'sauces', name: 'Sauces', icon: 'Droplets', section: 'snacks', subcategories: ['Ketchup', 'Soy Sauce', 'Chutney'], image: 'https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=200' },
  { id: 'ice-creams', name: 'Ice Creams', icon: 'IceCreamCone', section: 'snacks', subcategories: ['Cones', 'Cups', 'Family Packs'], image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200' },
  { id: 'paan-corner', name: 'Paan Corner', icon: 'Leaf', section: 'snacks', subcategories: ['Mouth Freshener', 'Supari', 'Paan'], image: 'https://images.unsplash.com/photo-1590779033100-9f60a05a013d?w=200' },

  { id: 'desi-ghee-oils', name: 'Desi Ghee & Oils', icon: 'Droplets', section: 'local', subcategories: ['Pure Desi Ghee', 'Mustard Oil', 'Cold Pressed'], image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200' },
  { id: 'farm-fresh', name: 'Farm Fresh', icon: 'Sprout', section: 'local', subcategories: ['Farm Vegetables', 'Farm Fruits', 'Organic'], image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=200' },
  { id: 'homemade-pickles', name: 'Homemade Pickles', icon: 'Jar', section: 'local', subcategories: ['Mango', 'Mixed', 'Lemon', 'Chilli'], image: 'https://images.unsplash.com/photo-1589135233689-3fadf08e2e1a?w=200' },
  { id: 'local-dairy', name: 'Local Dairy', icon: 'MilkOff', section: 'local', subcategories: ['Fresh Milk', 'Dahi', 'Makhan', 'Lassi'], image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200' },
  { id: 'desi-masale', name: 'Desi Masale', icon: 'Flame', section: 'local', subcategories: ['Homemade', 'Stone Ground', 'Traditional'], image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=200' },
  { id: 'sattu-traditional', name: 'Sattu & Traditional', icon: 'Wheat', section: 'local', subcategories: ['Sattu', 'Chura', 'Litti'], image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=200' },
  { id: 'festival-essentials', name: 'Festival Essentials', icon: 'Sparkles', section: 'local', subcategories: ['Puja Items', 'Decorations', 'Sweets'], image: 'https://images.unsplash.com/photo-1604823191457-2f8f0d6f8b74?w=200' },
  { id: 'regional-sweets', name: 'Regional Sweets', icon: 'Cake', section: 'local', subcategories: ['Laddu', 'Peda', 'Barfi', 'Rasgulla'], image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200' },

  { id: 'bath-body', name: 'Bath & Body', icon: 'Bath', section: 'beauty', subcategories: ['Soap', 'Body Wash', 'Lotion'], image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200' },
  { id: 'hair', name: 'Hair', icon: 'Scissors', section: 'beauty', subcategories: ['Shampoo', 'Oil', 'Conditioner'], image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200' },
  { id: 'skin-face', name: 'Skin & Face', icon: 'Sparkle', section: 'beauty', subcategories: ['Face Wash', 'Cream', 'Sunscreen'], image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=200' },
  { id: 'baby-care', name: 'Baby Care', icon: 'Baby', section: 'beauty', subcategories: ['Diapers', 'Wipes', 'Baby Food'], image: 'https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=200' },

  { id: 'home-lifestyle', name: 'Home Lifestyle', icon: 'Lamp', section: 'household', subcategories: ['Decor', 'Storage', 'Kitchen Tools'], image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200' },
  { id: 'cleaners', name: 'Cleaners', icon: 'SprayCanIcon', section: 'household', subcategories: ['Floor', 'Toilet', 'Kitchen'], image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=200' },
  { id: 'electronics', name: 'Electronics', icon: 'Plug', section: 'household', subcategories: ['Batteries', 'Bulbs', 'Cables'], image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200' },
  { id: 'stationery', name: 'Stationery', icon: 'PenTool', section: 'household', subcategories: ['Pens', 'Notebooks', 'Tape'], image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=200' },
];
