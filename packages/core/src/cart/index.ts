import type { Product } from '../catalog';
import { addMoney, money, multiplyMoney, type Money } from '../money';

export type CartLine = Readonly<{
  productId: string;
  productSlug: string;
  quantity: number;
  unitPrice: Money;
}>;

export type Cart = Readonly<{ lines: readonly CartLine[] }>;

export const emptyCart = (): Cart => ({ lines: [] });

export function normalizeQuantity(quantity: number, maxQuantity = 9999): number {
  if (!Number.isFinite(quantity)) throw new TypeError('Cart quantity must be finite.');
  if (!Number.isSafeInteger(maxQuantity) || maxQuantity < 1) {
    throw new RangeError('Maximum quantity must be a positive safe integer.');
  }
  return Math.min(Math.max(Math.trunc(quantity), 1), maxQuantity);
}

export function addCartItem(cart: Cart, product: Product, quantity = 1): Cart {
  const maxQuantity = product.maxQuantity ?? 9999;
  const existing = cart.lines.find((line) => line.productId === product.id);
  const nextQuantity = normalizeQuantity((existing?.quantity ?? 0) + quantity, maxQuantity);
  const line: CartLine = {
    productId: product.id,
    productSlug: product.slug,
    quantity: nextQuantity,
    unitPrice: product.price,
  };

  return {
    lines: existing
      ? cart.lines.map((item) => (item.productId === product.id ? line : item))
      : [...cart.lines, line],
  };
}

export function updateCartItem(cart: Cart, product: Product, quantity: number): Cart {
  if (quantity <= 0) return removeCartItem(cart, product.id);
  if (!cart.lines.some((line) => line.productId === product.id)) {
    return addCartItem(cart, product, quantity);
  }
  return {
    lines: cart.lines.map((line) =>
      line.productId === product.id
        ? { ...line, quantity: normalizeQuantity(quantity, product.maxQuantity ?? 9999) }
        : line,
    ),
  };
}

export function removeCartItem(cart: Cart, productId: string): Cart {
  return { lines: cart.lines.filter((line) => line.productId !== productId) };
}

export function clearCart(): Cart {
  return emptyCart();
}

export function cartTotal(cart: Cart, currency?: string): Money {
  const resolvedCurrency = currency ?? cart.lines[0]?.unitPrice.currency;
  if (!resolvedCurrency) throw new TypeError('Currency is required to total an empty cart.');
  return cart.lines.reduce(
    (total, line) => addMoney(total, multiplyMoney(line.unitPrice, line.quantity)),
    money(0, resolvedCurrency),
  );
}
