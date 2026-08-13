import { productsInCategory, searchProducts, sortProducts, } from '@vendora/core';
import { useDeferredValue, useState } from 'react';
import { useStorefront } from '../config/provider.js';
export function useCatalog(options = {}) {
    const { catalog } = useStorefront();
    const [query, setQuery] = useState(options.query ?? '');
    const [categoryId, setCategoryId] = useState(options.categoryId ?? null);
    const [sort, setSort] = useState(options.sort ?? 'name-asc');
    const deferredQuery = useDeferredValue(query);
    const categoryProducts = categoryId
        ? productsInCategory(catalog.products, catalog.categories, categoryId)
        : [...catalog.products];
    const products = sortProducts(searchProducts(categoryProducts, deferredQuery), sort);
    return { categoryId, products, query, setCategoryId, setQuery, setSort, sort };
}
//# sourceMappingURL=use-catalog.js.map