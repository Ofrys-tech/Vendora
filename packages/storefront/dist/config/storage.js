import { addCartItem, emptyCart } from '@vendora/core';
export function storefrontStorageKey(namespace, key) {
    return `${namespace}:${key}:v1`;
}
export function loadCart(storage, namespace, products) {
    try {
        const parsed = JSON.parse(storage.getItem(storefrontStorageKey(namespace, 'cart')) ?? 'null');
        if (!parsed ||
            typeof parsed !== 'object' ||
            !('lines' in parsed) ||
            !Array.isArray(parsed.lines)) {
            return emptyCart();
        }
        const byId = new Map(products.map((product) => [product.id, product]));
        return parsed.lines.reduce((cart, candidate) => {
            if (!candidate || typeof candidate !== 'object')
                return cart;
            const productId = 'productId' in candidate ? candidate.productId : null;
            const quantity = 'quantity' in candidate ? candidate.quantity : null;
            const product = typeof productId === 'string' ? byId.get(productId) : undefined;
            if (!product || typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity <= 0)
                return cart;
            return addCartItem(cart, product, quantity);
        }, emptyCart());
    }
    catch {
        return emptyCart();
    }
}
export function saveCart(storage, namespace, cart) {
    storage.setItem(storefrontStorageKey(namespace, 'cart'), JSON.stringify({
        lines: cart.lines.map(({ productId, quantity }) => ({ productId, quantity })),
        version: 1,
    }));
}
export function loadFavorites(storage, namespace, products) {
    try {
        const parsed = JSON.parse(storage.getItem(storefrontStorageKey(namespace, 'favorites')) ?? 'null');
        if (!parsed ||
            typeof parsed !== 'object' ||
            !('productIds' in parsed) ||
            !Array.isArray(parsed.productIds)) {
            return [];
        }
        const knownIds = new Set(products.map((product) => product.id));
        return [
            ...new Set(parsed.productIds.filter((id) => typeof id === 'string' && knownIds.has(id))),
        ];
    }
    catch {
        return [];
    }
}
export function saveFavorites(storage, namespace, productIds) {
    storage.setItem(storefrontStorageKey(namespace, 'favorites'), JSON.stringify({ productIds, version: 1 }));
}
//# sourceMappingURL=storage.js.map