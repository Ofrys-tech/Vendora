import { type Cart, type Product } from '@vendora/core';
import { type ReactNode } from 'react';
import type { StorefrontConfig } from './types';
export type CartController = Readonly<{
    add: (product: Product, quantity?: number) => void;
    cart: Cart;
    clear: () => void;
    closeDrawer: () => void;
    drawerOpen: boolean;
    openDrawer: () => void;
    remove: (productId: string) => void;
    setDrawerOpen: (open: boolean) => void;
    update: (product: Product, quantity: number) => void;
}>;
export type FavoritesController = Readonly<{
    favoriteIds: readonly string[];
    isFavorite: (productId: string) => boolean;
    toggle: (productId: string) => void;
}>;
export type StorefrontProviderProps = Readonly<{
    children: ReactNode;
    config: StorefrontConfig;
}>;
export declare function StorefrontProvider({ children, config }: StorefrontProviderProps): import("react").JSX.Element;
export declare function useStorefront(): StorefrontConfig;
export declare function useCart(): CartController;
export declare function useFavorites(): FavoritesController;
//# sourceMappingURL=provider.d.ts.map