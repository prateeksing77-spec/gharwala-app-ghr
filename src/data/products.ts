import { Product } from '@/types';

export const products: Product[] = [
  // Vegetables
  { id: 'p1', name: 'Tomato', nameHindi: 'Tamatar', category: 'vegetables-fruits', subcategory: 'Fresh Vegetables', price: 40, mrp: 50, weight: '1kg', weightVariants: ['500g', '1kg', '2kg'], image: 'https://images.unsplash.com/photo-1546470427-0d4db154ceb8?w=200', description: 'Farm fresh red tomatoes, perfect for curries and salads.', isFarmFresh: true, inStock: true },
  { id: 'p2', name: 'Onion', nameHindi: 'Pyaaz', category: 'vegetables-fruits', subcategory: 'Fresh Vegetables', price: 30, mrp: 30, weight: '1kg', weightVariants: ['500g', '1kg', '2kg'], image: 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=200', description: 'Premium quality onions for everyday cooking.', inStock: true },
  { id: 'p3', name: 'Potato', nameHindi: 'Aloo', category: 'vegetables-fruits', subcategory: 'Fresh Vegetables', price: 25, mrp: 25, weight: '1kg', weightVariants: ['500g', '1kg', '2kg'], image: 'https://images.unsplash.com/photo-1518977676601-b28d4e90e4a0?w=200', description: 'Fresh potatoes, ideal for sabzi and fries.', inStock: true },
  { id: 'p4', name: 'Green Peas', nameHindi: 'Matar', category: 'vegetables-fruits', subcategory: 'Fresh Vegetables', price: 60, mrp: 60, weight: '1kg', weightVariants: ['500g', '1kg'], image: 'https://images.unsplash.com/photo-1587735243615-c03f25aaff15?w=200', description: 'Fresh green peas for pulao and sabzi.', isFarmFresh: true, inStock: true },
  { id: 'p5', name: 'Capsicum', nameHindi: 'Shimla Mirch', category: 'vegetables-fruits', subcategory: 'Fresh Vegetables', price: 80, mrp: 80, weight: '1kg', image: 'https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=200', description: 'Fresh green capsicum for salads and stir fry.', inStock: true },

  // Fruits
  { id: 'p6', name: 'Apple', nameHindi: 'Seb', category: 'vegetables-fruits', subcategory: 'Fresh Fruits', price: 150, mrp: 150, weight: '1kg', weightVariants: ['500g', '1kg'], image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200', description: 'Fresh Shimla apples, crisp and sweet.', inStock: true },
  { id: 'p7', name: 'Banana', nameHindi: 'Kela', category: 'vegetables-fruits', subcategory: 'Fresh Fruits', price: 40, mrp: 40, weight: '1 dozen', image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=200', description: 'Ripe and sweet bananas.', inStock: true },
  { id: 'p8', name: 'Orange', nameHindi: 'Santra', category: 'vegetables-fruits', subcategory: 'Fresh Fruits', price: 80, mrp: 80, weight: '1kg', image: 'https://images.unsplash.com/photo-1547514701-42782101795e?w=200', description: 'Juicy Nagpur oranges.', inStock: true },
  { id: 'p9', name: 'Mango', nameHindi: 'Aam', category: 'vegetables-fruits', subcategory: 'Fresh Fruits', price: 120, mrp: 120, weight: '1kg', image: 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=200', description: 'Sweet Desi mangoes, seasonal delight.', isFarmFresh: true, inStock: true },

  // Dairy
  { id: 'p10', name: 'Amul Milk 1L', nameHindi: 'Doodh', category: 'dairy-bread-eggs', subcategory: 'Milk', price: 60, mrp: 60, weight: '1L', weightVariants: ['500ml', '1L'], image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=200', description: 'Fresh toned milk for daily use.', inStock: true },
  { id: 'p11', name: 'Paneer 200g', nameHindi: 'Paneer', category: 'dairy-bread-eggs', subcategory: 'Curd & Paneer', price: 80, mrp: 80, weight: '200g', weightVariants: ['200g', '500g'], image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200', description: 'Soft and fresh paneer for everyday cooking.', inStock: true },
  { id: 'p12', name: 'Curd 400g', nameHindi: 'Dahi', category: 'dairy-bread-eggs', subcategory: 'Curd & Paneer', price: 40, mrp: 40, weight: '400g', image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=200', description: 'Thick creamy curd, set naturally.', inStock: true },
  { id: 'p13', name: 'Butter 100g', nameHindi: 'Makhan', category: 'dairy-bread-eggs', subcategory: 'Milk', price: 55, mrp: 60, weight: '100g', weightVariants: ['100g', '200g', '500g'], image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=200', description: 'Creamy and delicious Amul butter.', inStock: true },
  { id: 'p14', name: 'Brown Bread', category: 'dairy-bread-eggs', subcategory: 'Bread', price: 45, mrp: 50, weight: '400g', image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200', description: 'Healthy whole wheat brown bread.', inStock: true },
  { id: 'p15', name: 'Farm Eggs', nameHindi: 'Ande', category: 'dairy-bread-eggs', subcategory: 'Eggs', price: 80, mrp: 90, weight: '12 pcs', image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=200', description: 'Farm fresh eggs, protein packed.', isFarmFresh: true, inStock: true },

  // Atta Rice Dal
  { id: 'p16', name: 'Aashirvaad Atta 5kg', nameHindi: 'Gehun ka Atta', category: 'atta-rice-dal', subcategory: 'Atta & Flour', price: 295, mrp: 310, weight: '5kg', weightVariants: ['1kg', '5kg', '10kg'], image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200', description: 'Whole wheat flour for soft rotis.', inStock: true },
  { id: 'p17', name: 'Basmati Rice 1kg', nameHindi: 'Basmati Chawal', category: 'atta-rice-dal', subcategory: 'Rice', price: 90, mrp: 90, weight: '1kg', weightVariants: ['1kg', '5kg'], image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=200', description: 'Long grain aromatic basmati rice.', inStock: true },
  { id: 'p18', name: 'Toor Dal 1kg', nameHindi: 'Arhar Dal', category: 'atta-rice-dal', subcategory: 'Dal & Pulses', price: 140, mrp: 140, weight: '1kg', image: 'https://images.unsplash.com/photo-1613743983303-b3e89f8a2b80?w=200', description: 'Premium quality toor dal for daily cooking.', inStock: true },
  { id: 'p19', name: 'Moong Dal 1kg', nameHindi: 'Moong Dal', category: 'atta-rice-dal', subcategory: 'Dal & Pulses', price: 120, mrp: 120, weight: '1kg', image: 'https://images.unsplash.com/photo-1613743983303-b3e89f8a2b80?w=200', description: 'Yellow moong dal, easy to cook.', inStock: true },

  // Oil Ghee Masala
  { id: 'p20', name: 'Fortune Sunflower Oil', category: 'oil-ghee-masala', subcategory: 'Cooking Oil', price: 160, mrp: 190, weight: '1L', weightVariants: ['1L', '2L', '5L'], image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200', description: 'Light and healthy sunflower cooking oil.', inStock: true },

  // Snacks
  { id: 'p21', name: 'Lays Chips', category: 'chips-namkeen', subcategory: 'Chips', price: 20, mrp: 20, weight: '52g', image: 'https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=200', description: 'Classic salted potato chips.', inStock: true },
  { id: 'p22', name: 'Haldiram Namkeen', category: 'chips-namkeen', subcategory: 'Namkeen', price: 40, mrp: 40, weight: '200g', image: 'https://images.unsplash.com/photo-1599490659213-e2b9527b711e?w=200', description: 'Crispy and spicy bhujia namkeen.', inStock: true },
  { id: 'p23', name: 'Dark Fantasy', category: 'sweets-chocolates', subcategory: 'Chocolates', price: 30, mrp: 30, weight: '75g', image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=200', description: 'Choco filled cookies, rich and indulgent.', inStock: true },
  { id: 'p24', name: 'Maggi 4 Pack', category: 'instant-food', subcategory: 'Noodles', price: 56, mrp: 56, weight: '280g', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=200', description: '2 minute noodles with tastemaker. Family pack.', inStock: true },

  // Beverages
  { id: 'p25', name: 'Coca Cola 750ml', category: 'drinks-juices', subcategory: 'Soft Drinks', price: 40, mrp: 40, weight: '750ml', weightVariants: ['250ml', '750ml', '2L'], image: 'https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200', description: 'Refreshing cola drink.', inStock: true },
  { id: 'p26', name: 'Frooti 1L', category: 'drinks-juices', subcategory: 'Juices', price: 25, mrp: 25, weight: '1L', image: 'https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=200', description: 'Mango drink with real fruit juice.', inStock: true },
  { id: 'p27', name: 'Bisleri 1L', category: 'drinks-juices', subcategory: 'Water', price: 20, mrp: 20, weight: '1L', image: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200', description: 'Pure mineral water.', inStock: true },
  { id: 'p28', name: 'Tata Tea Gold', category: 'tea-coffee', subcategory: 'Tea', price: 190, mrp: 220, weight: '250g', weightVariants: ['100g', '250g', '500g'], image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200', description: '15% long leaves for rich taste.', inStock: true },
  { id: 'p29', name: 'Nescafe Classic', category: 'tea-coffee', subcategory: 'Coffee', price: 175, mrp: 200, weight: '100g', image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200', description: 'Instant coffee for a perfect cup.', inStock: true },

  // Local Specials
  { id: 'p30', name: 'Desi Ghee 500g', nameHindi: 'Shuddh Desi Ghee', category: 'desi-ghee-oils', subcategory: 'Pure Desi Ghee', price: 350, mrp: 400, weight: '500g', weightVariants: ['500g', '1kg'], image: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=200', description: 'Traditional bilona method desi ghee.', isLocal: true, inStock: true },
  { id: 'p31', name: 'Fresh Paneer 500g', nameHindi: 'Taza Paneer', category: 'local-dairy', subcategory: 'Fresh Milk', price: 150, mrp: 150, weight: '500g', image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200', description: 'Locally made fresh paneer, soft and creamy.', isLocal: true, isFarmFresh: true, inStock: true },
  { id: 'p32', name: 'Homemade Pickle 500g', nameHindi: 'Ghar ka Achaar', category: 'homemade-pickles', subcategory: 'Mixed', price: 120, mrp: 120, weight: '500g', image: 'https://images.unsplash.com/photo-1589135233689-3fadf08e2e1a?w=200', description: 'Mixed vegetable pickle, grandma style.', isLocal: true, inStock: true },
  { id: 'p33', name: 'Sattu 1kg', nameHindi: 'Sattu', category: 'sattu-traditional', subcategory: 'Sattu', price: 80, mrp: 80, weight: '1kg', image: 'https://images.unsplash.com/photo-1574653853027-5382a3d23a15?w=200', description: 'Roasted gram flour, perfect for drinks and litti.', isLocal: true, isFarmFresh: true, inStock: true },
  { id: 'p34', name: 'Desi Haldi 200g', nameHindi: 'Haldi', category: 'desi-masale', subcategory: 'Stone Ground', price: 60, mrp: 80, weight: '200g', image: 'https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=200', description: 'Stone ground turmeric with high curcumin.', isLocal: true, inStock: true },
  { id: 'p35', name: 'Mustard Oil 1L', nameHindi: 'Sarson ka Tel', category: 'desi-ghee-oils', subcategory: 'Mustard Oil', price: 180, mrp: 210, weight: '1L', image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=200', description: 'Cold pressed pure mustard oil.', isLocal: true, inStock: true },

  // Beauty & Care
  { id: 'p36', name: 'Dove Soap', category: 'bath-body', subcategory: 'Soap', price: 52, mrp: 60, weight: '100g', image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=200', description: 'Moisturizing beauty bar.', inStock: true },
  { id: 'p37', name: 'Head & Shoulders', category: 'hair', subcategory: 'Shampoo', price: 190, mrp: 220, weight: '180ml', image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200', description: 'Anti-dandruff shampoo.', inStock: true },

  // Household
  { id: 'p38', name: 'Harpic Cleaner', category: 'cleaners', subcategory: 'Toilet', price: 85, mrp: 99, weight: '500ml', image: 'https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=200', description: 'Powerful toilet cleaning liquid.', inStock: true },
  { id: 'p39', name: 'Duracell AA Battery', category: 'electronics', subcategory: 'Batteries', price: 120, mrp: 140, weight: '4 pcs', image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=200', description: 'Long lasting AA batteries.', inStock: true },
  { id: 'p40', name: 'Classmate Notebook', category: 'stationery', subcategory: 'Notebooks', price: 45, mrp: 50, weight: '180 pages', image: 'https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?w=200', description: 'Single line ruled notebook.', inStock: true },
];

export const banners = [
  { id: 'b1', title: 'Fresh Vegetables', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', gradient: 'from-primary/80 to-primary/40' },
  { id: 'b2', title: 'Local Specials', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=400', gradient: 'from-accent/80 to-accent/40' },
  { id: 'b3', title: 'Flat 20% Off on Dal', image: 'https://images.unsplash.com/photo-1613743983303-b3e89f8a2b80?w=400', gradient: 'from-destructive/60 to-primary/40' },
  { id: 'b4', title: 'Free Delivery Above Rs.200', image: 'https://images.unsplash.com/photo-1604823191457-2f8f0d6f8b74?w=400', gradient: 'from-primary/60 to-accent/40' },
];

export const coupons = [
  { code: 'FIRST50', discount: 50, type: 'flat' as const, minOrder: 200 },
  { code: 'GHAR10', discount: 10, type: 'percent' as const, minOrder: 300 },
  { code: 'LOCAL20', discount: 20, type: 'flat' as const, minOrder: 150 },
];

export const areas = [
  'Jalalpur', 'Darbeshpur', 'Trilochan', 'Mariahu', 'Jaunpur City',
];
