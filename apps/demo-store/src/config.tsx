import { defineStorefrontConfig } from '@vendora/storefront';
import { demoCategories, demoProducts } from './catalog';
import { demoCheckoutClient } from './fake-checkout';

export const demoConfig = defineStorefrontConfig({
  brand: { name: 'Northstar Digital', shortName: 'Northstar' },
  catalog: { categories: demoCategories, products: demoProducts },
  checkoutClient: demoCheckoutClient,
  content: {
    afterCatalog: (
      <p className="demo-note">All products and payment outcomes are local fixtures.</p>
    ),
  },
  footer: [{ items: [{ label: 'Catalog', to: '/catalog' }], title: 'Explore' }],
  formatMoney: (value) =>
    new Intl.NumberFormat('en-US', {
      currency: value.currency,
      style: 'currency',
    }).format(value.amountMinor / 100),
  locale: 'en-US',
  navigation: [
    { label: 'Catalog', to: '/catalog' },
    { label: 'How it works', to: '/about' },
  ],
  paymentMethods: [
    {
      description: 'Completes with automatic delivery.',
      id: 'success',
      label: 'Successful test payment',
    },
    {
      description: 'Remains unconfirmed for polling demos.',
      id: 'pending',
      label: 'Pending test payment',
    },
    {
      description: 'Returns a terminal failure.',
      id: 'failed',
      label: 'Failed test payment',
    },
    {
      description: 'Confirms payment but pauses delivery.',
      id: 'manual',
      label: 'Manual review',
    },
  ],
  routes: {
    cart: '/cart',
    catalog: '/catalog',
    checkout: '/checkout',
    favorites: '/favorites',
    home: '/',
  },
  storageNamespace: 'northstar-demo',
  support: [{ label: 'Demo documentation', url: '/about' }],
  theme: {
    accent: '#ff6b35',
    accentContrast: '#190b05',
    background: '#f4f0e8',
    radius: '18px',
    surface: '#fffdf8',
  },
});
