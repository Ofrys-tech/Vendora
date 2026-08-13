import { type CatalogSort, type Product } from '@vendora/core';
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
export declare function useCatalog(options?: CatalogOptions): CatalogController;
//# sourceMappingURL=use-catalog.d.ts.map