import {
  addCartItem,
  buildCategoryTree,
  cartTotal,
  categoryDescendantIds,
  clearCart,
  emptyCart,
  money,
  productsInCategory,
  removeCartItem,
  searchProducts,
  sortProducts,
  updateCartItem,
  type Category,
  type Product,
} from '../src/index';
import { describe, expect, it } from 'vitest';

const categories: Category[] = [
  { id: 'root', name: 'Documents', parentId: null, slug: 'documents' },
  { id: 'templates', name: 'Templates', parentId: 'root', slug: 'templates' },
];
const products: Product[] = [
  {
    categoryId: 'templates',
    description: 'Reusable planning template',
    id: 'template',
    maxQuantity: 5,
    name: 'Planning Template',
    price: money(1200, 'usd'),
    slug: 'planning-template',
    tags: ['planning'],
  },
  {
    categoryId: 'root',
    id: 'guide',
    name: 'Reference Guide',
    price: money(800, 'USD'),
    slug: 'reference-guide',
  },
];

describe('catalog rules', () => {
  it('searches product fields and sorts without mutating input', () => {
    expect(searchProducts(products, 'planning')).toEqual([products[0]]);
    expect(sortProducts(products, 'price-asc').map((item) => item.id)).toEqual([
      'guide',
      'template',
    ]);
    expect(products.map((item) => item.id)).toEqual(['template', 'guide']);
  });

  it('builds category trees and includes descendants', () => {
    expect(buildCategoryTree(categories)[0]?.children[0]?.id).toBe('templates');
    expect(categoryDescendantIds(categories, 'root')).toEqual(new Set(['root', 'templates']));
    expect(productsInCategory(products, categories, 'root')).toHaveLength(2);
  });

  it('rejects invalid category relationships', () => {
    expect(() =>
      buildCategoryTree([{ id: 'child', name: 'Child', parentId: 'missing', slug: 'child' }]),
    ).toThrow('Unknown parent category');
    expect(() =>
      buildCategoryTree([
        { id: 'a', name: 'A', parentId: 'b', slug: 'a' },
        { id: 'b', name: 'B', parentId: 'a', slug: 'b' },
      ]),
    ).toThrow('cycle');
  });
});

describe('cart rules', () => {
  it('adds, updates, clamps, removes, and clears immutable lines', () => {
    const first = addCartItem(emptyCart(), products[0]!, 2);
    const incremented = addCartItem(first, products[0]!, 10);
    expect(first.lines[0]?.quantity).toBe(2);
    expect(incremented.lines[0]?.quantity).toBe(5);
    expect(updateCartItem(incremented, products[0]!, 3).lines[0]?.quantity).toBe(3);
    expect(removeCartItem(incremented, 'template')).toEqual(emptyCart());
    expect(clearCart()).toEqual(emptyCart());
  });

  it('calculates totals from price snapshots', () => {
    const cart = addCartItem(addCartItem(emptyCart(), products[0]!, 2), products[1]!, 1);
    expect(cartTotal(cart)).toEqual(money(3200, 'USD'));
    expect(() => cartTotal(emptyCart())).toThrow('Currency is required');
  });

  it('rejects cross-currency totals and invalid quantities', () => {
    const other: Product = { ...products[1]!, id: 'eur', price: money(100, 'EUR') };
    const cart = addCartItem(addCartItem(emptyCart(), products[0]!), other);
    expect(() => cartTotal(cart)).toThrow('Currency mismatch');
    expect(() => addCartItem(emptyCart(), products[0]!, Number.NaN)).toThrow('finite');
  });
});
