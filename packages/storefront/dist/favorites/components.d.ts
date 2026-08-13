import type { Product } from '@vendora/core';
import type { ReactNode } from 'react';
export type FavoritesPageTemplateProps = Readonly<{
    description?: ReactNode;
    detailPath?: (product: Product) => string;
    productMedia?: (product: Product) => ReactNode;
    title?: ReactNode;
}>;
export declare function FavoritesPageTemplate({ description, detailPath, productMedia, title, }: FavoritesPageTemplateProps): import("react").JSX.Element;
//# sourceMappingURL=components.d.ts.map