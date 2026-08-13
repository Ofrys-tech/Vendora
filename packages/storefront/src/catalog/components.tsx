import type { CatalogSort, Category, Product } from '@vendora/core';
import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { useCart, useFavorites, useStorefront } from '../config/provider.js';
import { assertSafeUrl } from '../content/security.js';
import { Button, EmptyState, PageHero } from '../layout/primitives.js';
import type { CatalogController } from './use-catalog.js';

export type ProductMedia = Readonly<{
  alt: string;
  src: string;
}>;

export function ProductGallery({ media }: Readonly<{ media: readonly ProductMedia[] }>) {
  if (!media.length) return null;
  return (
    <div className="vendora-gallery">
      {media.map((item) => (
        <img alt={item.alt} key={item.src} loading="lazy" src={assertSafeUrl(item.src)} />
      ))}
    </div>
  );
}

export type ProductCardProps = Readonly<{
  detailPath?: ((product: Product) => string) | undefined;
  media?: ReactNode;
  product: Product;
}>;

export function ProductCard({ detailPath, media, product }: ProductCardProps) {
  const { formatMoney } = useStorefront();
  const { add } = useCart();
  const { isFavorite, toggle } = useFavorites();
  const productPath = detailPath?.(product);
  const title = productPath ? (
    <Link to={assertSafeUrl(productPath)}>{product.name}</Link>
  ) : (
    product.name
  );

  return (
    <article className="vendora-product-card">
      {media ? <div className="vendora-product-card__media">{media}</div> : null}
      <div className="vendora-product-card__body">
        <h2>{title}</h2>
        {product.description ? <p>{product.description}</p> : null}
        <strong>{formatMoney(product.price)}</strong>
      </div>
      <div className="vendora-product-card__actions">
        <Button onClick={() => add(product)}>Add to cart</Button>
        <Button
          aria-pressed={isFavorite(product.id)}
          onClick={() => toggle(product.id)}
          variant="ghost"
        >
          {isFavorite(product.id) ? 'Remove favorite' : 'Add favorite'}
        </Button>
      </div>
    </article>
  );
}

export type CatalogFiltersProps = Readonly<{
  catalog: CatalogController;
  categories?: readonly Category[];
}>;

const sortLabels: Record<CatalogSort, string> = {
  'name-asc': 'Name',
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
};

export function CatalogFilters({ catalog, categories }: CatalogFiltersProps) {
  const config = useStorefront();
  const options = categories ?? config.catalog.categories;
  return (
    <div className="vendora-catalog-filters">
      <label>
        Search
        <input
          onChange={(event) => catalog.setQuery(event.currentTarget.value)}
          type="search"
          value={catalog.query}
        />
      </label>
      <label>
        Category
        <select
          onChange={(event) => catalog.setCategoryId(event.currentTarget.value || null)}
          value={catalog.categoryId ?? ''}
        >
          <option value="">All categories</option>
          {options.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Sort
        <select
          onChange={(event) => catalog.setSort(event.currentTarget.value as CatalogSort)}
          value={catalog.sort}
        >
          {Object.entries(sortLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export type CatalogPageTemplateProps = Readonly<{
  catalog: CatalogController;
  description?: ReactNode;
  detailPath?: (product: Product) => string;
  empty?: ReactNode;
  productMedia?: (product: Product) => ReactNode;
  title?: ReactNode;
}>;

export function CatalogPageTemplate({
  catalog,
  description,
  detailPath,
  empty,
  productMedia,
  title = 'Catalog',
}: CatalogPageTemplateProps) {
  const config = useStorefront();
  return (
    <section className="vendora-page vendora-catalog-page">
      <PageHero description={description} title={title} />
      <CatalogFilters catalog={catalog} />
      {catalog.products.length ? (
        <div className="vendora-product-grid">
          {catalog.products.map((product) => (
            <ProductCard
              detailPath={detailPath}
              key={product.id}
              media={productMedia?.(product)}
              product={product}
            />
          ))}
        </div>
      ) : (
        (empty ?? (
          <EmptyState description="Try changing the active filters." title="No products found" />
        ))
      )}
      {config.content?.afterCatalog}
    </section>
  );
}
