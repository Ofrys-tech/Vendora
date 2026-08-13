import type { Product } from '@vendora/core';
import type { ReactNode } from 'react';
import { useCart, useFavorites, useStorefront } from '../config/provider';
import { Button, PageHero } from '../layout/primitives';
import { sanitizeHtml } from './security';

export type SafeHtmlProps = Readonly<{
  as?: 'article' | 'div' | 'section';
  className?: string;
  html: string;
}>;

export function SafeHtml({ as: Element = 'div', className = '', html }: SafeHtmlProps) {
  return (
    <Element
      className={`vendora-rich-text ${className}`.trim()}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}

export type ContentPageTemplateProps = Readonly<{
  children?: ReactNode;
  description?: ReactNode;
  html?: string;
  title: ReactNode;
}>;

export function ContentPageTemplate({
  children,
  description,
  html,
  title,
}: ContentPageTemplateProps) {
  return (
    <article className="vendora-page vendora-content-page">
      <PageHero description={description} title={title} />
      {html ? <SafeHtml html={html} /> : children}
    </article>
  );
}

export type ProductPageTemplateProps = Readonly<{
  children?: ReactNode;
  descriptionHtml?: string;
  media?: ReactNode;
  product: Product;
}>;

export function ProductPageTemplate({
  children,
  descriptionHtml,
  media,
  product,
}: ProductPageTemplateProps) {
  const { formatMoney } = useStorefront();
  const { add } = useCart();
  const { isFavorite, toggle } = useFavorites();
  return (
    <article className="vendora-page vendora-product-page">
      <div className="vendora-product-page__media">{media}</div>
      <div className="vendora-product-page__details">
        <PageHero
          description={descriptionHtml ? <SafeHtml html={descriptionHtml} /> : product.description}
          title={product.name}
        />
        <strong className="vendora-product-page__price">{formatMoney(product.price)}</strong>
        <div className="vendora-product-page__actions">
          <Button onClick={() => add(product)}>Add to cart</Button>
          <Button
            aria-pressed={isFavorite(product.id)}
            onClick={() => toggle(product.id)}
            variant="secondary"
          >
            {isFavorite(product.id) ? 'Remove favorite' : 'Add favorite'}
          </Button>
        </div>
        {children}
      </div>
    </article>
  );
}
