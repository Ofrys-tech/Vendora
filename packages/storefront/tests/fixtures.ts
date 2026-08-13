import {
  money,
  type CheckoutState,
  type Product,
  type StartCheckoutCommand,
  type StartCheckoutResult,
} from '@vendora/core';
import type { StorefrontConfig } from '../src/index';

export const products: readonly Product[] = [
  {
    categoryId: 'templates',
    description: 'A reusable project template',
    id: 'project-template',
    maxQuantity: 4,
    name: 'Project Template',
    price: money(1200, 'USD'),
    slug: 'project-template',
    tags: ['project'],
  },
  {
    categoryId: 'guides',
    description: 'A concise reference guide',
    id: 'reference-guide',
    name: 'Reference Guide',
    price: money(800, 'USD'),
    slug: 'reference-guide',
  },
];

const checkout: CheckoutState = {
  deliveryItems: [],
  fulfillmentStatus: 'pending',
  id: 'checkout-1',
  paymentStatus: 'pending',
  status: 'awaiting_payment',
};

export function createConfig(overrides: Partial<StorefrontConfig> = {}): StorefrontConfig {
  return {
    brand: { name: 'Example Store' },
    catalog: {
      categories: [
        { id: 'digital', name: 'Digital goods', parentId: null, slug: 'digital' },
        { id: 'templates', name: 'Templates', parentId: 'digital', slug: 'templates' },
        { id: 'guides', name: 'Guides', parentId: 'digital', slug: 'guides' },
      ],
      products,
    },
    checkoutClient: {
      async getCheckoutStatus(): Promise<CheckoutState> {
        return checkout;
      },
      async startCheckout(command: StartCheckoutCommand): Promise<StartCheckoutResult> {
        return { checkout, paymentUrl: null, total: money(command.cart.lines.length * 100, 'USD') };
      },
    },
    footer: [],
    formatMoney: (value) => `${value.currency} ${(value.amountMinor / 100).toFixed(2)}`,
    locale: 'en-US',
    navigation: [{ label: 'Catalog', to: '/catalog' }],
    paymentMethods: [{ id: 'test', label: 'Test payment' }],
    routes: {
      cart: '/cart',
      catalog: '/catalog',
      checkout: '/checkout',
      favorites: '/favorites',
      home: '/',
    },
    storageNamespace: 'example-store',
    support: [{ label: 'Email support', url: 'mailto:help@example.test' }],
    ...overrides,
  };
}
