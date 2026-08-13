import { type Cart, type Product } from '@vendora/core';
export type StorefrontStorageKey = 'cart' | 'favorites';
export declare function storefrontStorageKey(namespace: string, key: StorefrontStorageKey): string;
export declare function loadCart(storage: Storage, namespace: string, products: readonly Product[]): Cart;
export declare function saveCart(storage: Storage, namespace: string, cart: Cart): void;
export declare function loadFavorites(storage: Storage, namespace: string, products: readonly Product[]): string[];
export declare function saveFavorites(storage: Storage, namespace: string, productIds: readonly string[]): void;
//# sourceMappingURL=storage.d.ts.map