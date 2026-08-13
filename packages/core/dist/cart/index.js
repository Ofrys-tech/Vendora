import { addMoney, money, multiplyMoney } from '../money';
export const emptyCart = () => ({ lines: [] });
export function normalizeQuantity(quantity, maxQuantity = 9999) {
    if (!Number.isFinite(quantity))
        throw new TypeError('Cart quantity must be finite.');
    if (!Number.isSafeInteger(maxQuantity) || maxQuantity < 1) {
        throw new RangeError('Maximum quantity must be a positive safe integer.');
    }
    return Math.min(Math.max(Math.trunc(quantity), 1), maxQuantity);
}
export function addCartItem(cart, product, quantity = 1) {
    const maxQuantity = product.maxQuantity ?? 9999;
    const existing = cart.lines.find((line) => line.productId === product.id);
    const nextQuantity = normalizeQuantity((existing?.quantity ?? 0) + quantity, maxQuantity);
    const line = {
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
export function updateCartItem(cart, product, quantity) {
    if (quantity <= 0)
        return removeCartItem(cart, product.id);
    if (!cart.lines.some((line) => line.productId === product.id)) {
        return addCartItem(cart, product, quantity);
    }
    return {
        lines: cart.lines.map((line) => line.productId === product.id
            ? { ...line, quantity: normalizeQuantity(quantity, product.maxQuantity ?? 9999) }
            : line),
    };
}
export function removeCartItem(cart, productId) {
    return { lines: cart.lines.filter((line) => line.productId !== productId) };
}
export function clearCart() {
    return emptyCart();
}
export function cartTotal(cart, currency) {
    const resolvedCurrency = currency ?? cart.lines[0]?.unitPrice.currency;
    if (!resolvedCurrency)
        throw new TypeError('Currency is required to total an empty cart.');
    return cart.lines.reduce((total, line) => addMoney(total, multiplyMoney(line.unitPrice, line.quantity)), money(0, resolvedCurrency));
}
//# sourceMappingURL=index.js.map