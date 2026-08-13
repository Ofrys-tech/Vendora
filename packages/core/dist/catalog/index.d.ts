import type { Money } from '../money.js';
export type Product = Readonly<{
    categoryId: string;
    description?: string;
    id: string;
    maxQuantity?: number;
    name: string;
    price: Money;
    slug: string;
    tags?: readonly string[];
}>;
export type Category = Readonly<{
    id: string;
    name: string;
    parentId: string | null;
    slug: string;
}>;
export type CategoryNode = Category & Readonly<{
    children: readonly CategoryNode[];
}>;
export type CatalogSort = 'name-asc' | 'price-asc' | 'price-desc';
export declare function searchProducts(products: readonly Product[], query: string): Product[];
export declare function sortProducts(products: readonly Product[], sort: CatalogSort): Product[];
export declare function categoryDescendantIds(categories: readonly Category[], categoryId: string): Set<string>;
export declare function productsInCategory(products: readonly Product[], categories: readonly Category[], categoryId: string): Product[];
export declare function buildCategoryTree(categories: readonly Category[]): CategoryNode[];
//# sourceMappingURL=index.d.ts.map