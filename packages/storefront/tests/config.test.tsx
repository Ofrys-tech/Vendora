import { render, renderHook, screen } from '@testing-library/react';
import type { PropsWithChildren } from 'react';
import {
  defineStorefrontConfig,
  StorefrontProvider,
  useCart,
  useStorefront,
  validateStorefrontConfig,
} from '../src/index';
import { createConfig } from './fixtures';
import { describe, expect, it } from 'vitest';

function ConfigProbe() {
  const config = useStorefront();
  return <span>{`${config.brand.name}:${config.locale}`}</span>;
}

describe('storefront config boundary', () => {
  it('validates and provides typed consumer configuration and theme tokens', () => {
    const config = defineStorefrontConfig(
      createConfig({ theme: { accent: '#123456', maxWidth: '70rem' } }),
    );
    const { container } = render(
      <StorefrontProvider config={config}>
        <ConfigProbe />
      </StorefrontProvider>,
    );

    expect(screen.getByText('Example Store:en-US')).toBeTruthy();
    expect(container.firstElementChild?.getAttribute('data-storefront')).toBe('example-store');
    expect(
      (container.firstElementChild as HTMLElement).style.getPropertyValue('--vendora-accent'),
    ).toBe('#123456');
  });

  it('rejects invalid namespaces, URLs, and product-category references', () => {
    expect(() =>
      validateStorefrontConfig(createConfig({ storageNamespace: 'bad namespace' })),
    ).toThrow('Storage namespace');
    expect(() =>
      validateStorefrontConfig(
        createConfig({ support: [{ label: 'Unsafe', url: 'javascript:alert(1)' }] }),
      ),
    ).toThrow('Unsafe URL');
    expect(() =>
      validateStorefrontConfig(
        createConfig({
          catalog: {
            categories: [],
            products: createConfig().catalog.products,
          },
        }),
      ),
    ).toThrow('unknown category');
  });

  it('requires hooks to stay inside the provider boundary', () => {
    expect(() => renderHook(() => useCart())).toThrow('inside StorefrontProvider');
  });

  it('can wrap hooks without a router because routes remain consumer-side', () => {
    const config = createConfig();
    const wrapper = ({ children }: PropsWithChildren) => (
      <StorefrontProvider config={config}>{children}</StorefrontProvider>
    );
    expect(renderHook(() => useStorefront(), { wrapper }).result.current.routes.catalog).toBe(
      '/catalog',
    );
  });
});
