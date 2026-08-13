import type { Product } from '@vendora/core';
import { useStorefront, useFavorites } from '../config/provider.js';

export function useFavoriteProducts(): readonly Product[] {
  const { catalog } = useStorefront();
  const { favoriteIds } = useFavorites();
  const ids = new Set(favoriteIds);
  return catalog.products.filter((product) => ids.has(product.id));
}
