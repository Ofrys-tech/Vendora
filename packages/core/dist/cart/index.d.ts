import type { Product } from '../catalog';
import { type Money } from '../money';
export type CartLine = Readonly<{
    productId: string;
    productSlug: string;
    quantity: number;
    unitPrice: Money;
}>;
export type Cart = Readonly<{
    lines: readonly CartLine[];
}>;
export declare const emptyCart: () => Cart;
export declare function normalizeQuantity(quantity: number, maxQuantity?: number): number;
export declare function addCartItem(cart: Cart, product: Product, quantity?: number): Cart;
export declare function updateCartItem(cart: Cart, product: Product, quantity: number): Cart;
export declare function removeCartItem(cart: Cart, productId: string): Cart;
export declare function clearCart(): Cart;
export declare function cartTotal(cart: Cart, currency?: string): Money;
//# sourceMappingURL=index.d.ts.map