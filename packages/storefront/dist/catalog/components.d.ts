import type { Category, Product } from '@vendora/core';
import type { ReactNode } from 'react';
import type { CatalogController } from './use-catalog.js';
export type ProductMedia = Readonly<{
    alt: string;
    src: string;
}>;
export declare function ProductGallery({ media }: Readonly<{
    media: readonly ProductMedia[];
}>): import("react").JSX.Element | null;
export type ProductCardProps = Readonly<{
    detailPath?: ((product: Product) => string) | undefined;
    media?: ReactNode;
    product: Product;
}>;
export declare function ProductCard({ detailPath, media, product }: ProductCardProps): import("react").JSX.Element;
export type CatalogFiltersProps = Readonly<{
    catalog: CatalogController;
    categories?: readonly Category[];
}>;
export declare function CatalogFilters({ catalog, categories }: CatalogFiltersProps): import("react").JSX.Element;
export type CatalogPageTemplateProps = Readonly<{
    catalog: CatalogController;
    description?: ReactNode;
    detailPath?: (product: Product) => string;
    empty?: ReactNode;
    productMedia?: (product: Product) => ReactNode;
    title?: ReactNode;
}>;
export declare function CatalogPageTemplate({ catalog, description, detailPath, empty, productMedia, title, }: CatalogPageTemplateProps): import("react").JSX.Element;
//# sourceMappingURL=components.d.ts.map