import { Product } from '@/types';

export const products: Product[] = [
  // Grocery & Kitchen
  { id: 'p1', name: 'Fresh Tomato', nameHindi: 'Tamatar', category: 'vegetables-fruits', subcategory: 'Fresh Vegetables', price: 30, mrp: 40, weight: '500g', weightVariants: ['250g', '500g', '1kg'], image: '/placeholder.svg', description: 'Farm fresh red tomatoes, perfect for curries and salads.', isFarmFresh: true, inStock: true },
  { id: 'p2', name: 'Onion', nameHindi: 'Pyaaz', category: 'vegetables-fruits', subcategory: 'Fresh Vegetables', price: 35, mrp: 45, weight: '1kg', weightVariants: ['500g', '1kg', '2kg'], image: '/placeholder.svg', description: 'Premium quality onions for everyday cooking.', inStock: true },
  { id: 'p3', name: 'Potato', nameHindi: 'Aloo', category: 'vegetables-fruits', subcategory: 'Fresh Vegetables', price: 25, mrp: 35, weight: '1kg', weightVariants: ['500g', '1kg', '2kg'], image: '/placeholder.svg', description: 'Fresh potatoes, ideal for sabzi and fries.', inStock: true },
  { id: 'p4', name: 'Green Chilli', nameHindi: 'Hari Mirch', category: 'vegetables-fruits', subcategory: 'Fresh Vegetables', price: 10, mrp: 15, weight: '100g', image: '/placeholder.svg', description: 'Spicy green chillies for that extra kick.', inStock: true },
  { id: 'p5', name: 'Banana', nameHindi: 'Kela', category: 'vegetables-fruits', subcategory: 'Fresh Fruits', price: 40, mrp: 50, weight: '6 pcs', image: '/placeholder.svg', description: 'Ripe and sweet bananas.', inStock: true },

  { id: 'p6', name: 'Aashirvaad Atta', nameHindi: 'Gehun ka Atta', category: 'atta-rice-dal', subcategory: 'Atta & Flour', price: 280, mrp: 320, weight: '5kg', weightVariants: ['1kg', '5kg', '10kg'], image: '/placeholder.svg', description: 'Whole wheat flour for soft rotis.', inStock: true },
  { id: 'p7', name: 'Basmati Rice', nameHindi: 'Basmati Chawal', category: 'atta-rice-dal', subcategory: 'Rice', price: 180, mrp: 220, weight: '1kg', weightVariants: ['1kg', '5kg'], image: '/placeholder.svg', description: 'Long grain aromatic basmati rice.', inStock: true },
  { id: 'p8', name: 'Toor Dal', nameHindi: 'Arhar Dal', category: 'atta-rice-dal', subcategory: 'Dal & Pulses', price: 140, mrp: 170, weight: '1kg', image: '/placeholder.svg', description: 'Premium quality toor dal for daily cooking.', inStock: true },

  { id: 'p9', name: 'Fortune Sunflower Oil', category: 'oil-ghee-masala', subcategory: 'Cooking Oil', price: 160, mrp: 190, weight: '1L', weightVariants: ['1L', '2L', '5L'], image: '/placeholder.svg', description: 'Light and healthy sunflower cooking oil.', inStock: true },
  { id: 'p10', name: 'Amul Butter', nameHindi: 'Makhan', category: 'dairy-bread-eggs', subcategory: 'Milk', price: 56, mrp: 60, weight: '100g', weightVariants: ['100g', '200g', '500g'], image: '/placeholder.svg', description: 'Creamy and delicious Amul butter.', inStock: true },
  { id: 'p11', name: 'Amul Milk', nameHindi: 'Doodh', category: 'dairy-bread-eggs', subcategory: 'Milk', price: 30, mrp: 30, weight: '500ml', weightVariants: ['500ml', '1L'], image: '/placeholder.svg', description: 'Fresh toned milk.', inStock: true },
  { id: 'p12', name: 'Brown Bread', category: 'dairy-bread-eggs', subcategory: 'Bread', price: 45, mrp: 50, weight: '400g', image: '/placeholder.svg', description: 'Healthy whole wheat brown bread.', inStock: true },
  { id: 'p13', name: 'Farm Eggs', nameHindi: 'Ande', category: 'dairy-bread-eggs', subcategory: 'Eggs', price: 80, mrp: 90, weight: '12 pcs', image: '/placeholder.svg', description: 'Farm fresh eggs, protein packed.', isFarmFresh: true, inStock: true },

  // Snacks & Drinks
  { id: 'p14', name: 'Lays Classic Salted', category: 'chips-namkeen', subcategory: 'Chips', price: 20, mrp: 20, weight: '52g', image: '/placeholder.svg', description: 'Classic salted potato chips.', inStock: true },
  { id: 'p15', name: 'Haldiram Bhujia', category: 'chips-namkeen', subcategory: 'Namkeen', price: 65, mrp: 75, weight: '200g', image: '/placeholder.svg', description: 'Crispy and spicy bhujia namkeen.', inStock: true },
  { id: 'p16', name: 'Dairy Milk Silk', category: 'sweets-chocolates', subcategory: 'Chocolates', price: 85, mrp: 90, weight: '60g', image: '/placeholder.svg', description: 'Smooth and creamy chocolate bar.', inStock: true },
  { id: 'p17', name: 'Coca Cola', category: 'drinks-juices', subcategory: 'Soft Drinks', price: 40, mrp: 40, weight: '750ml', weightVariants: ['250ml', '750ml', '2L'], image: '/placeholder.svg', description: 'Refreshing cola drink.', inStock: true },
  { id: 'p18', name: 'Real Mango Juice', category: 'drinks-juices', subcategory: 'Juices', price: 99, mrp: 110, weight: '1L', image: '/placeholder.svg', description: 'Pure mango juice with real fruit pulp.', inStock: true },
  { id: 'p19', name: 'Tata Tea Gold', category: 'tea-coffee', subcategory: 'Tea', price: 190, mrp: 220, weight: '250g', weightVariants: ['100g', '250g', '500g'], image: '/placeholder.svg', description: '15% long leaves for rich taste.', inStock: true },
  { id: 'p20', name: 'Nescafe Classic', category: 'tea-coffee', subcategory: 'Coffee', price: 175, mrp: 200, weight: '100g', image: '/placeholder.svg', description: 'Instant coffee for a perfect cup.', inStock: true },
  { id: 'p21', name: 'Maggi Noodles', category: 'instant-food', subcategory: 'Noodles', price: 14, mrp: 14, weight: '70g', image: '/placeholder.svg', description: '2 minute noodles with tastemaker.', inStock: true },

  // Local Specials
  { id: 'p22', name: 'Pure Desi Ghee', nameHindi: 'Shuddh Desi Ghee', category: 'desi-ghee-oils', subcategory: 'Pure Desi Ghee', price: 650, mrp: 750, weight: '1L', weightVariants: ['500ml', '1L'], image: '/placeholder.svg', description: 'Traditional bilona method desi ghee.', isLocal: true, inStock: true },
  { id: 'p23', name: 'Mustard Oil', nameHindi: 'Sarson ka Tel', category: 'desi-ghee-oils', subcategory: 'Mustard Oil', price: 180, mrp: 210, weight: '1L', image: '/placeholder.svg', description: 'Cold pressed pure mustard oil.', isLocal: true, inStock: true },
  { id: 'p24', name: 'Mango Pickle', nameHindi: 'Aam ka Achaar', category: 'homemade-pickles', subcategory: 'Mango', price: 120, mrp: 150, weight: '400g', image: '/placeholder.svg', description: 'Homemade mango pickle with traditional recipe.', isLocal: true, inStock: true },
  { id: 'p25', name: 'Mixed Pickle', nameHindi: 'Mix Achaar', category: 'homemade-pickles', subcategory: 'Mixed', price: 110, mrp: 140, weight: '400g', image: '/placeholder.svg', description: 'Mixed vegetable pickle, grandma style.', isLocal: true, inStock: true },
  { id: 'p26', name: 'Fresh Sattu', nameHindi: 'Sattu', category: 'sattu-traditional', subcategory: 'Sattu', price: 90, mrp: 110, weight: '500g', image: '/placeholder.svg', description: 'Roasted gram flour, perfect for drinks and litti.', isLocal: true, isFarmFresh: true, inStock: true },
  { id: 'p27', name: 'Desi Haldi Powder', nameHindi: 'Haldi', category: 'desi-masale', subcategory: 'Stone Ground', price: 60, mrp: 80, weight: '100g', image: '/placeholder.svg', description: 'Stone ground turmeric with high curcumin.', isLocal: true, inStock: true },
  { id: 'p28', name: 'Gur (Jaggery)', nameHindi: 'Gur', category: 'festival-essentials', subcategory: 'Puja Items', price: 70, mrp: 85, weight: '500g', image: '/placeholder.svg', description: 'Pure sugarcane jaggery.', isLocal: true, inStock: true },

  // Beauty & Personal Care
  { id: 'p29', name: 'Dove Soap', category: 'bath-body', subcategory: 'Soap', price: 52, mrp: 60, weight: '100g', image: '/placeholder.svg', description: 'Moisturizing beauty bar.', inStock: true },
  { id: 'p30', name: 'Head & Shoulders', category: 'hair', subcategory: 'Shampoo', price: 190, mrp: 220, weight: '180ml', image: '/placeholder.svg', description: 'Anti-dandruff shampoo.', inStock: true },

  // Household
  { id: 'p31', name: 'Harpic Toilet Cleaner', category: 'cleaners', subcategory: 'Toilet', price: 85, mrp: 99, weight: '500ml', image: '/placeholder.svg', description: 'Powerful toilet cleaning liquid.', inStock: true },
  { id: 'p32', name: 'Duracell AA Battery', category: 'electronics', subcategory: 'Batteries', price: 120, mrp: 140, weight: '4 pcs', image: '/placeholder.svg', description: 'Long lasting AA batteries.', inStock: true },
  { id: 'p33', name: 'Classmate Notebook', category: 'stationery', subcategory: 'Notebooks', price: 45, mrp: 50, weight: '180 pages', image: '/placeholder.svg', description: 'Single line ruled notebook.', inStock: true },
];

export const banners = [
  { id: 'b1', title: 'Fresh Vegetables', image: '/placeholder.svg', gradient: 'from-primary/80 to-primary/40' },
  { id: 'b2', title: 'Local Specials', image: '/placeholder.svg', gradient: 'from-accent/80 to-accent/40' },
  { id: 'b3', title: 'Flat 20% Off on Dal', image: '/placeholder.svg', gradient: 'from-destructive/60 to-primary/40' },
  { id: 'b4', title: 'Free Delivery Above 299', image: '/placeholder.svg', gradient: 'from-primary/60 to-accent/40' },
];

export const coupons = [
  { code: 'FIRST50', discount: 50, type: 'flat' as const, minOrder: 200 },
  { code: 'GHAR10', discount: 10, type: 'percent' as const, minOrder: 300 },
  { code: 'LOCAL20', discount: 20, type: 'flat' as const, minOrder: 150 },
];

export const areas = [
  'Boring Road', 'Kankarbagh', 'Patliputra', 'Rajendra Nagar', 'Bailey Road',
  'Danapur', 'Phulwari', 'Anisabad', 'Jakkanpur', 'Gardanibagh',
];
