import { buildCategoryTree } from '@vendora/core';
import { assertSafeUrl } from '../content/security';
import type { NavigationItem, StorefrontConfig } from './types';

function assertUnique(values: readonly string[], label: string): void {
  if (new Set(values).size !== values.length) throw new TypeError(`${label} IDs must be unique.`);
}

function validateNavigation(items: readonly NavigationItem[], label: string): void {
  for (const item of items) {
    if (!item.label.trim()) throw new TypeError(`${label} labels must not be empty.`);
    assertSafeUrl(item.to);
  }
}

export function validateStorefrontConfig(config: StorefrontConfig): void {
  if (!config.brand.name.trim()) throw new TypeError('Brand name must not be empty.');
  if (!config.locale.trim()) throw new TypeError('Locale must not be empty.');
  if (typeof config.formatMoney !== 'function')
    throw new TypeError('formatMoney must be a function.');
  if (!/^[a-z0-9][a-z0-9._-]{0,63}$/iu.test(config.storageNamespace)) {
    throw new TypeError(
      'Storage namespace must contain only letters, numbers, dots, underscores, or dashes.',
    );
  }

  for (const [name, path] of Object.entries(config.routes)) {
    if (!path.startsWith('/') || path.startsWith('//')) {
      throw new TypeError(`Route ${name} must be a local absolute path.`);
    }
    assertSafeUrl(path);
  }
  if (config.brand.logoUrl) assertSafeUrl(config.brand.logoUrl);
  validateNavigation(config.navigation, 'Navigation');
  for (const section of config.footer)
    validateNavigation(section.items, `Footer section ${section.title}`);
  for (const link of config.support) assertSafeUrl(link.url);

  assertUnique(
    config.catalog.products.map((product) => product.id),
    'Product',
  );
  assertUnique(
    config.catalog.categories.map((category) => category.id),
    'Category',
  );
  assertUnique(
    config.paymentMethods.map((method) => method.id),
    'Payment method',
  );
  buildCategoryTree(config.catalog.categories);

  const categoryIds = new Set(config.catalog.categories.map((category) => category.id));
  for (const product of config.catalog.products) {
    if (!categoryIds.has(product.categoryId)) {
      throw new TypeError(
        `Product ${product.id} references unknown category ${product.categoryId}.`,
      );
    }
  }
  if (
    typeof config.checkoutClient.startCheckout !== 'function' ||
    typeof config.checkoutClient.getCheckoutStatus !== 'function'
  ) {
    throw new TypeError('checkoutClient must implement the CheckoutClient interface.');
  }
}

export function defineStorefrontConfig(config: StorefrontConfig): StorefrontConfig {
  validateStorefrontConfig(config);
  return config;
}
