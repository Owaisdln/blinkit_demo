export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '₹0';
  return `₹${Number(amount).toFixed(0)}`;
};

export const formatDiscount = (price, discountPrice) => {
  if (!price || !discountPrice || discountPrice >= price) return null;
  return Math.round(((price - discountPrice) / price) * 100);
};
