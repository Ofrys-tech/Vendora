import type { Product } from '@vendora/core';
import type { ReactNode } from 'react';
import { ProductCard } from '../catalog/components';
import { useStorefront } from '../config/provider';
import { ButtonLink, EmptyState, PageHero } from '../layout/primitives';
import { useFavoriteProducts } from './use-favorite-products';

export type FavoritesPageTemplateProps = Readonly<{
  description?: ReactNode;
  detailPath?: (product: Product) => string;
  productMedia?: (product: Product) => ReactNode;
  title?: ReactNode;
}>;

export function FavoritesPageTemplate({
  description,
  detailPath,
  productMedia,
  title = 'Favorites',
}: FavoritesPageTemplateProps) {
  const products = useFavoriteProducts();
  const { routes } = useStorefront();
  return (
    <section className="vendora-page vendora-favorites-page">
      <PageHero description={description} title={title} />
      {products.length ? (
        <div className="vendora-product-grid">
          {products.map((product) => (
            <ProductCard
              detailPath={detailPath}
              key={product.id}
              media={productMedia?.(product)}
              product={product}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          action={<ButtonLink to={routes.catalog}>Browse catalog</ButtonLink>}
          title="No favorites yet"
        />
      )}
    </section>
  );
}
