import { useStorefront, useFavorites } from '../config/provider.js';
export function useFavoriteProducts() {
    const { catalog } = useStorefront();
    const { favoriteIds } = useFavorites();
    const ids = new Set(favoriteIds);
    return catalog.products.filter((product) => ids.has(product.id));
}
//# sourceMappingURL=use-favorite-products.js.map