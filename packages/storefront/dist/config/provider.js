import { jsx as _jsx } from "react/jsx-runtime";
import { addCartItem, clearCart, removeCartItem, updateCartItem, } from '@vendora/core';
import { createContext, useContext, useEffect, useState, } from 'react';
import { validateStorefrontConfig } from './config.js';
import { loadCart, loadFavorites, saveCart, saveFavorites } from './storage.js';
const StorefrontContext = createContext(null);
const themeTokenNames = {
    accent: '--vendora-accent',
    accentContrast: '--vendora-accent-contrast',
    background: '--vendora-background',
    border: '--vendora-border',
    fontFamily: '--vendora-font-family',
    maxWidth: '--vendora-max-width',
    muted: '--vendora-muted',
    radius: '--vendora-radius',
    surface: '--vendora-surface',
    text: '--vendora-text',
};
function themeStyle(tokens) {
    if (!tokens)
        return {};
    return Object.fromEntries(Object.entries(tokens).map(([name, value]) => [
        themeTokenNames[name],
        value,
    ]));
}
function browserStorage() {
    try {
        return typeof window === 'undefined' ? null : window.localStorage;
    }
    catch {
        return null;
    }
}
export function StorefrontProvider({ children, config }) {
    validateStorefrontConfig(config);
    const storage = browserStorage();
    const [cart, setCart] = useState(() => storage ? loadCart(storage, config.storageNamespace, config.catalog.products) : { lines: [] });
    const [favoriteIds, setFavoriteIds] = useState(() => storage ? loadFavorites(storage, config.storageNamespace, config.catalog.products) : []);
    const [drawerOpen, setDrawerOpen] = useState(false);
    useEffect(() => {
        if (storage)
            saveCart(storage, config.storageNamespace, cart);
    }, [cart, config.storageNamespace, storage]);
    useEffect(() => {
        if (storage)
            saveFavorites(storage, config.storageNamespace, favoriteIds);
    }, [config.storageNamespace, favoriteIds, storage]);
    const knownProductIds = new Set(config.catalog.products.map((product) => product.id));
    const cartController = {
        add(product, quantity) {
            if (!knownProductIds.has(product.id))
                throw new TypeError(`Unknown catalog product: ${product.id}.`);
            setCart((current) => addCartItem(current, product, quantity));
        },
        cart,
        clear() {
            setCart(clearCart());
        },
        closeDrawer() {
            setDrawerOpen(false);
        },
        drawerOpen,
        openDrawer() {
            setDrawerOpen(true);
        },
        remove(productId) {
            setCart((current) => removeCartItem(current, productId));
        },
        setDrawerOpen,
        update(product, quantity) {
            if (!knownProductIds.has(product.id))
                throw new TypeError(`Unknown catalog product: ${product.id}.`);
            setCart((current) => updateCartItem(current, product, quantity));
        },
    };
    const favoritesController = {
        favoriteIds,
        isFavorite(productId) {
            return favoriteIds.includes(productId);
        },
        toggle(productId) {
            if (!knownProductIds.has(productId))
                throw new TypeError(`Unknown catalog product: ${productId}.`);
            setFavoriteIds((current) => current.includes(productId)
                ? current.filter((candidate) => candidate !== productId)
                : [...current, productId]);
        },
    };
    return (_jsx(StorefrontContext.Provider, { value: { cart: cartController, config, favorites: favoritesController }, children: _jsx("div", { className: "vendora-root", "data-storefront": config.storageNamespace, style: themeStyle(config.theme), children: children }) }));
}
function useStorefrontContext() {
    const value = useContext(StorefrontContext);
    if (!value)
        throw new Error('Vendora hooks must be used inside StorefrontProvider.');
    return value;
}
export function useStorefront() {
    return useStorefrontContext().config;
}
export function useCart() {
    return useStorefrontContext().cart;
}
export function useFavorites() {
    return useStorefrontContext().favorites;
}
//# sourceMappingURL=provider.js.map