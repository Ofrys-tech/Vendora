import type { Product } from '@vendora/core';
import type { ReactNode } from 'react';
export type SafeHtmlProps = Readonly<{
    as?: 'article' | 'div' | 'section';
    className?: string;
    html: string;
}>;
export declare function SafeHtml({ as: Element, className, html }: SafeHtmlProps): import("react").JSX.Element;
export type ContentPageTemplateProps = Readonly<{
    children?: ReactNode;
    description?: ReactNode;
    html?: string;
    title: ReactNode;
}>;
export declare function ContentPageTemplate({ children, description, html, title, }: ContentPageTemplateProps): import("react").JSX.Element;
export type ProductPageTemplateProps = Readonly<{
    children?: ReactNode;
    descriptionHtml?: string;
    media?: ReactNode;
    product: Product;
}>;
export declare function ProductPageTemplate({ children, descriptionHtml, media, product, }: ProductPageTemplateProps): import("react").JSX.Element;
//# sourceMappingURL=components.d.ts.map