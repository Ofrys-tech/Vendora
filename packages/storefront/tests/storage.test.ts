import { addCartItem, emptyCart } from '@vendora/core';
import {
  loadCart,
  loadFavorites,
  saveCart,
  saveFavorites,
  storefrontStorageKey,
} from '../src/index';
import { products } from './fixtures';
import { beforeEach, describe, expect, it } from 'vitest';

describe('namespaced storefront storage', () => {
  beforeEach(() => window.localStorage.clear());

  it('isolates stores and persists only product IDs and quantities', () => {
    const cart = addCartItem(emptyCart(), products[0]!, 2);
    saveCart(window.localStorage, 'store-a', cart);
    saveFavorites(window.localStorage, 'store-b', [products[1]!.id]);

    expect(storefrontStorageKey('store-a', 'cart')).toBe('store-a:cart:v1');
    expect(loadCart(window.localStorage, 'store-a', products)).toEqual(cart);
    expect(loadCart(window.localStorage, 'store-b', products)).toEqual(emptyCart());
    expect(loadFavorites(window.localStorage, 'store-b', products)).toEqual(['reference-guide']);
    expect(window.localStorage.getItem('store-a:cart:v1')).not.toContain('unitPrice');
  });

  it('recovers safely from malformed, unknown, duplicate, and excessive stored values', () => {
    window.localStorage.setItem(
      'store-a:cart:v1',
      JSON.stringify({
        lines: [
          { productId: products[0]!.id, quantity: 99 },
          { productId: 'removed-product', quantity: 2 },
          { productId: products[1]!.id, quantity: 'invalid' },
        ],
      }),
    );
    window.localStorage.setItem(
      'store-a:favorites:v1',
      JSON.stringify({ productIds: [products[0]!.id, products[0]!.id, 'removed-product'] }),
    );

    expect(loadCart(window.localStorage, 'store-a', products).lines).toEqual([
      expect.objectContaining({ productId: products[0]!.id, quantity: 4 }),
    ]);
    expect(loadFavorites(window.localStorage, 'store-a', products)).toEqual([products[0]!.id]);

    window.localStorage.setItem('store-a:cart:v1', '{broken');
    expect(loadCart(window.localStorage, 'store-a', products)).toEqual(emptyCart());
  });
});
