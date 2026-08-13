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

export type CategoryNode = Category & Readonly<{ children: readonly CategoryNode[] }>;
export type CatalogSort = 'name-asc' | 'price-asc' | 'price-desc';

export function searchProducts(products: readonly Product[], query: string): Product[] {
  const normalized = query.trim().toLocaleLowerCase();
  if (!normalized) return [...products];

  return products.filter((product) =>
    [product.name, product.slug, product.description ?? '', ...(product.tags ?? [])]
      .join(' ')
      .toLocaleLowerCase()
      .includes(normalized),
  );
}

export function sortProducts(products: readonly Product[], sort: CatalogSort): Product[] {
  return [...products].sort((left, right) => {
    if (sort === 'price-asc' || sort === 'price-desc') {
      if (left.price.currency !== right.price.currency) {
        throw new TypeError('Products must use the same currency to be sorted by price.');
      }
      const difference = left.price.amountMinor - right.price.amountMinor;
      return sort === 'price-asc' ? difference : -difference;
    }

    return left.name.localeCompare(right.name);
  });
}

export function categoryDescendantIds(
  categories: readonly Category[],
  categoryId: string,
): Set<string> {
  const result = new Set([categoryId]);
  const pending = [categoryId];

  while (pending.length) {
    const parentId = pending.shift();
    for (const category of categories) {
      if (category.parentId === parentId && !result.has(category.id)) {
        result.add(category.id);
        pending.push(category.id);
      }
    }
  }

  return result;
}

export function productsInCategory(
  products: readonly Product[],
  categories: readonly Category[],
  categoryId: string,
): Product[] {
  const categoryIds = categoryDescendantIds(categories, categoryId);
  return products.filter((product) => categoryIds.has(product.categoryId));
}

export function buildCategoryTree(categories: readonly Category[]): CategoryNode[] {
  const byParent = new Map<string | null, Category[]>();
  const ids = new Set(categories.map((category) => category.id));

  for (const category of categories) {
    if (category.parentId !== null && !ids.has(category.parentId)) {
      throw new TypeError(`Unknown parent category: ${category.parentId}.`);
    }
    const siblings = byParent.get(category.parentId) ?? [];
    siblings.push(category);
    byParent.set(category.parentId, siblings);
  }

  const visiting = new Set<string>();
  const visit = (category: Category): CategoryNode => {
    if (visiting.has(category.id))
      throw new TypeError(`Category cycle detected at ${category.id}.`);
    visiting.add(category.id);
    const node = {
      ...category,
      children: (byParent.get(category.id) ?? []).map(visit),
    };
    visiting.delete(category.id);
    return node;
  };

  const roots = (byParent.get(null) ?? []).map(visit);
  const included = new Set<string>();
  const collect = (nodes: readonly CategoryNode[]) => {
    for (const node of nodes) {
      included.add(node.id);
      collect(node.children);
    }
  };
  collect(roots);
  if (included.size !== categories.length) throw new TypeError('Category tree contains a cycle.');
  return roots;
}
