import type { Category, CheckoutClient, Money, PaymentMethod, Product } from '@vendora/core';
import type { ReactNode } from 'react';

export type StorefrontBrand = Readonly<{
  logoAlt?: string;
  logoUrl?: string;
  name: string;
  shortName?: string;
}>;

export type StorefrontRoutes = Readonly<{
  cart: string;
  catalog: string;
  checkout: string;
  favorites: string;
  home: string;
}>;

export type NavigationItem = Readonly<{
  external?: boolean;
  label: string;
  to: string;
}>;

export type FooterSection = Readonly<{
  items: readonly NavigationItem[];
  title: string;
}>;

export type SupportLink = Readonly<{
  label: string;
  url: string;
}>;

export type PaymentMethodDescriptor = PaymentMethod &
  Readonly<{
    description?: string;
  }>;

export type StorefrontContentSlots = Readonly<{
  afterCatalog?: ReactNode;
  beforeFooter?: ReactNode;
  headerActions?: ReactNode;
  homeHero?: ReactNode;
}>;

export type StorefrontThemeTokens = Readonly<{
  accent?: string;
  accentContrast?: string;
  background?: string;
  border?: string;
  fontFamily?: string;
  maxWidth?: string;
  muted?: string;
  radius?: string;
  surface?: string;
  text?: string;
}>;

export type StorefrontCatalog = Readonly<{
  categories: readonly Category[];
  products: readonly Product[];
}>;

export type StorefrontConfig = Readonly<{
  brand: StorefrontBrand;
  catalog: StorefrontCatalog;
  checkoutClient: CheckoutClient;
  content?: StorefrontContentSlots;
  footer: readonly FooterSection[];
  formatMoney: (value: Money) => string;
  locale: string;
  navigation: readonly NavigationItem[];
  paymentMethods: readonly PaymentMethodDescriptor[];
  routes: StorefrontRoutes;
  storageNamespace: string;
  support: readonly SupportLink[];
  theme?: StorefrontThemeTokens;
}>;
