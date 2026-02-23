export const mockMalls = [
  {
    id: 1,
    name: 'Phoenix Marketcity',
    description: 'One of the largest malls in Bangalore with luxury brands, entertainment zones, and fine dining.',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800',
    rating: 4.7,
    distance: 2.5,
    category: 'premium',
    priceRange: 'high',
    activeOffers: 42,
    floors: 7,
    stores: 350,
    parking: true,
    foodCourt: true,
    popularity: 95,
    topOffers: [
      { store: 'Zara', discount: '30-70% off' },
      { store: 'PVR Cinemas', discount: 'Buy 1 Get 1 Free' },
      { store: 'Starbucks', discount: '20% off on beverages' }
    ]
  },
  {
    id: 2,
    name: 'Orion Mall',
    description: 'Popular mall known for its trendy stores, multiplex, and food court with diverse cuisines.',
    image: 'https://images.unsplash.com/photo-1572913017567-02f0649bc4d7?auto=format&fit=crop&w=800',
    rating: 4.5,
    distance: 3.2,
    category: 'premium',
    priceRange: 'medium',
    activeOffers: 35,
    floors: 5,
    stores: 280,
    parking: true,
    foodCourt: true,
    popularity: 88,
    topOffers: [
      { store: 'H&M', discount: '50% off on Summer Collection' },
      { store: 'INOX', discount: '25% off on Weekdays' },
      { store: 'McDonald\'s', discount: 'Free Fries with Burger' }
    ]
  },
  {
    id: 3,
    name: 'UB City',
    description: 'Luxury mall featuring high-end international brands, fine dining restaurants, and art galleries.',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800',
    rating: 4.8,
    distance: 4.1,
    category: 'luxury',
    priceRange: 'high',
    activeOffers: 28,
    floors: 4,
    stores: 120,
    parking: true,
    foodCourt: false,
    popularity: 92,
    topOffers: [
      { store: 'Louis Vuitton', discount: 'Gift with purchase' },
      { store: 'Gucci', discount: '10% off for members' },
      { store: 'Tiffany & Co.', discount: 'Free engraving' }
    ]
  },
  {
    id: 4,
    name: 'Mantri Square',
    description: 'Massive shopping complex with diverse retail options, entertainment, and dining facilities.',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=800',
    rating: 4.3,
    distance: 5.3,
    category: 'family',
    priceRange: 'medium',
    activeOffers: 55,
    floors: 6,
    stores: 400,
    parking: true,
    foodCourt: true,
    popularity: 85,
    topOffers: [
      { store: 'Big Bazaar', discount: 'Upto 60% off' },
      { store: 'Cinepolis', discount: 'Flat ₹100 off' },
      { store: 'KFC', discount: 'Buy 1 Get 1 Free' }
    ]
  },
  {
    id: 5,
    name: 'Forum Value Mall',
    description: 'Budget-friendly mall with great deals, factory outlets, and family entertainment options.',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800',
    rating: 4.2,
    distance: 6.8,
    category: 'budget',
    priceRange: 'low',
    activeOffers: 65,
    floors: 3,
    stores: 180,
    parking: true,
    foodCourt: true,
    popularity: 78,
    topOffers: [
      { store: 'Brand Factory', discount: 'Upto 80% off' },
      { store: 'Shoppers Stop', discount: 'Extra 20% off' },
      { store: 'Domino\'s', discount: '50% off on Pizzas' }
    ]
  }
];

export const mockOffers = [
  {
    id: 1,
    title: 'Weekend Shopping Spree',
    mall: 'Phoenix Marketcity',
    store: 'Multiple Stores',
    discount: 'Upto 70% OFF',
    validUntil: '2024-03-15',
    category: 'shopping',
    code: 'WEEKEND70',
    terms: 'Valid on weekends only'
  },
  {
    id: 2,
    title: 'Movie Mania',
    mall: 'Orion Mall',
    store: 'INOX Cinemas',
    discount: 'Buy 1 Get 1 Free',
    validUntil: '2024-03-10',
    category: 'entertainment',
    code: 'BOGOINOX',
    terms: 'Valid on weekdays'
  },
  {
    id: 3,
    title: 'Food Festival',
    mall: 'Mantri Square',
    store: 'Food Court',
    discount: '20% OFF',
    validUntil: '2024-03-20',
    category: 'food',
    code: 'EAT20',
    terms: 'Above ₹500 bill'
  }
];