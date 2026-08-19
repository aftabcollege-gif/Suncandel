export function applyDiscount(amount: number, discountPercent: number) {
  const pct = Math.max(0, Math.min(discountPercent, 100));
  return Math.round((amount * (1 - pct / 100) + Number.EPSILON) * 100) / 100;
}

export function computeLineTotal(unitPrice: number, quantity: number) {
  return Math.round((unitPrice * quantity + Number.EPSILON) * 100) / 100;
}

export function computeOrderTotal(lines: Array<{ unitPrice: number; quantity: number }>) {
  return lines.reduce((sum, line) => sum + computeLineTotal(line.unitPrice, line.quantity), 0);
}
