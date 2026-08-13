import {
  productsInCategory,
  searchProducts,
  sortProducts,
  type CatalogSort,
  type Product,
} from '@vendora/core';
import { useDeferredValue, useState } from 'react';
import { useStorefront } from '../config/provider.js';

export type CatalogController = Readonly<{
  categoryId: string | null;
  products: readonly Product[];
  query: string;
  setCategoryId: (categoryId: string | null) => void;
  setQuery: (query: string) => void;
  setSort: (sort: CatalogSort) => void;
  sort: CatalogSort;
}>;

export type CatalogOptions = Readonly<{
  categoryId?: string | null;
  query?: string;
  sort?: CatalogSort;
}>;

export function useCatalog(options: CatalogOptions = {}): CatalogController {
  const { catalog } = useStorefront();
  const [query, setQuery] = useState(options.query ?? '');
  const [categoryId, setCategoryId] = useState<string | null>(options.categoryId ?? null);
  const [sort, setSort] = useState<CatalogSort>(options.sort ?? 'name-asc');
  const deferredQuery = useDeferredValue(query);
  const categoryProducts = categoryId
    ? productsInCategory(catalog.products, catalog.categories, categoryId)
    : [...catalog.products];
  const products = sortProducts(searchProducts(categoryProducts, deferredQuery), sort);

  return { categoryId, products, query, setCategoryId, setQuery, setSort, sort };
}
