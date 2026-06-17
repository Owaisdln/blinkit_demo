export const ORDER_STATUSES = [
  'Placed',
  'Packed',
  'Out For Delivery',
  'Delivered',
  'Cancelled',
];

export const ORDER_STATUS_COLORS = {
  Placed: 'bg-blue-100 text-blue-700',
  Packed: 'bg-yellow-100 text-yellow-700',
  'Out For Delivery': 'bg-orange-100 text-orange-700',
  Delivered: 'bg-green-100 text-green-700',
  Cancelled: 'bg-red-100 text-red-700',
};

export const CATEGORY_EMOJI = {
  Vegetables: '🥦',
  Fruits: '🍎',
  Dairy: '🥛',
  Snacks: '🍟',
  Beverages: '🥤',
  Bakery: '🍞',
  Meat: '🥩',
  Frozen: '🧊',
  Household: '🧹',
  Personal: '🧴',
  Baby: '🍼',
  Pets: '🐾',
  Medicines: '💊',
  Default: '🛒',
};

export const getCategoryEmoji = (category) =>
  CATEGORY_EMOJI[category] || CATEGORY_EMOJI.Default;

export const PLACEHOLDER_IMAGE =
  'https://placehold.co/400x400/f3f3f3/9e9e9e?text=No+Image';
