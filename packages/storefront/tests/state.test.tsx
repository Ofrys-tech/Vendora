import { act, renderHook, waitFor } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import {
  StorefrontProvider,
  useCart,
  useCatalog,
  useFavoriteProducts,
  useFavorites,
} from '../src/index';
import { createConfig, products } from './fixtures';
import { beforeEach, describe, expect, it } from 'vitest';

describe('catalog, cart, and favorites hooks', () => {
  beforeEach(() => window.localStorage.clear());

  function wrapper({ children }: PropsWithChildren) {
    return <StorefrontProvider config={createConfig()}>{children}</StorefrontProvider>;
  }

  it('filters descendants, searches, and sorts without imposing URL state', async () => {
    const { result } = renderHook(() => useCatalog(), { wrapper });
    expect(result.current.products.map((product) => product.id)).toEqual([
      'project-template',
      'reference-guide',
    ]);

    act(() => result.current.setCategoryId('guides'));
    expect(result.current.products.map((product) => product.id)).toEqual(['reference-guide']);

    act(() => {
      result.current.setCategoryId(null);
      result.current.setSort('price-asc');
    });
    expect(result.current.products.map((product) => product.id)).toEqual([
      'reference-guide',
      'project-template',
    ]);

    act(() => result.current.setQuery('project'));
    expect(result.current.query).toBe('project');
    await waitFor(() =>
      expect(result.current.products.map((product) => product.id)).toEqual(['project-template']),
    );
  });

  it('updates cart through core rules and persists the current state', async () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => result.current.add(products[0]!, 2));
    expect(result.current.cart.lines[0]?.quantity).toBe(2);

    act(() => result.current.update(products[0]!, 99));
    expect(result.current.cart.lines[0]?.quantity).toBe(4);

    await waitFor(() =>
      expect(window.localStorage.getItem('example-store:cart:v1')).toContain('project-template'),
    );
    act(() => result.current.remove(products[0]!.id));
    expect(result.current.cart.lines).toEqual([]);
  });

  it('toggles known favorites and derives product data from the catalog', async () => {
    const { result } = renderHook(
      () => ({ favorites: useFavorites(), products: useFavoriteProducts() }),
      { wrapper },
    );
    act(() => result.current.favorites.toggle(products[1]!.id));
    expect(result.current.products.map((product) => product.id)).toEqual(['reference-guide']);
    expect(result.current.favorites.isFavorite(products[1]!.id)).toBe(true);
    await waitFor(() =>
      expect(window.localStorage.getItem('example-store:favorites:v1')).toContain(
        'reference-guide',
      ),
    );

    expect(() => result.current.favorites.toggle('unknown')).toThrow('Unknown catalog product');
  });
});
