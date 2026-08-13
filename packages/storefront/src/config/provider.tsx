import {
  addCartItem,
  clearCart,
  removeCartItem,
  updateCartItem,
  type Cart,
  type Product,
} from '@vendora/core';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { validateStorefrontConfig } from './config';
import { loadCart, loadFavorites, saveCart, saveFavorites } from './storage';
import type { StorefrontConfig, StorefrontThemeTokens } from './types';

export type CartController = Readonly<{
  add: (product: Product, quantity?: number) => void;
  cart: Cart;
  clear: () => void;
  closeDrawer: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  remove: (productId: string) => void;
  setDrawerOpen: (open: boolean) => void;
  update: (product: Product, quantity: number) => void;
}>;

export type FavoritesController = Readonly<{
  favoriteIds: readonly string[];
  isFavorite: (productId: string) => boolean;
  toggle: (productId: string) => void;
}>;

type StorefrontContextValue = Readonly<{
  cart: CartController;
  config: StorefrontConfig;
  favorites: FavoritesController;
}>;

const StorefrontContext = createContext<StorefrontContextValue | null>(null);

const themeTokenNames: Record<keyof StorefrontThemeTokens, `--vendora-${string}`> = {
  accent: '--vendora-accent',
  accentContrast: '--vendora-accent-contrast',
  background: '--vendora-background',
  border: '--vendora-border',
  fontFamily: '--vendora-font-family',
  maxWidth: '--vendora-max-width',
  muted: '--vendora-muted',
  radius: '--vendora-radius',
  surface: '--vendora-surface',
  text: '--vendora-text',
};

function themeStyle(tokens: StorefrontThemeTokens | undefined): CSSProperties {
  if (!tokens) return {};
  return Object.fromEntries(
    Object.entries(tokens).map(([name, value]) => [
      themeTokenNames[name as keyof StorefrontThemeTokens],
      value,
    ]),
  ) as CSSProperties;
}

function browserStorage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

export type StorefrontProviderProps = Readonly<{
  children: ReactNode;
  config: StorefrontConfig;
}>;

export function StorefrontProvider({ children, config }: StorefrontProviderProps) {
  validateStorefrontConfig(config);
  const storage = browserStorage();
  const [cart, setCart] = useState<Cart>(() =>
    storage ? loadCart(storage, config.storageNamespace, config.catalog.products) : { lines: [] },
  );
  const [favoriteIds, setFavoriteIds] = useState<readonly string[]>(() =>
    storage ? loadFavorites(storage, config.storageNamespace, config.catalog.products) : [],
  );
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (storage) saveCart(storage, config.storageNamespace, cart);
  }, [cart, config.storageNamespace, storage]);

  useEffect(() => {
    if (storage) saveFavorites(storage, config.storageNamespace, favoriteIds);
  }, [config.storageNamespace, favoriteIds, storage]);

  const knownProductIds = new Set(config.catalog.products.map((product) => product.id));
  const cartController: CartController = {
    add(product, quantity) {
      if (!knownProductIds.has(product.id))
        throw new TypeError(`Unknown catalog product: ${product.id}.`);
      setCart((current) => addCartItem(current, product, quantity));
    },
    cart,
    clear() {
      setCart(clearCart());
    },
    closeDrawer() {
      setDrawerOpen(false);
    },
    drawerOpen,
    openDrawer() {
      setDrawerOpen(true);
    },
    remove(productId) {
      setCart((current) => removeCartItem(current, productId));
    },
    setDrawerOpen,
    update(product, quantity) {
      if (!knownProductIds.has(product.id))
        throw new TypeError(`Unknown catalog product: ${product.id}.`);
      setCart((current) => updateCartItem(current, product, quantity));
    },
  };
  const favoritesController: FavoritesController = {
    favoriteIds,
    isFavorite(productId) {
      return favoriteIds.includes(productId);
    },
    toggle(productId) {
      if (!knownProductIds.has(productId))
        throw new TypeError(`Unknown catalog product: ${productId}.`);
      setFavoriteIds((current) =>
        current.includes(productId)
          ? current.filter((candidate) => candidate !== productId)
          : [...current, productId],
      );
    },
  };

  return (
    <StorefrontContext.Provider
      value={{ cart: cartController, config, favorites: favoritesController }}
    >
      <div
        className="vendora-root"
        data-storefront={config.storageNamespace}
        style={themeStyle(config.theme)}
      >
        {children}
      </div>
    </StorefrontContext.Provider>
  );
}

function useStorefrontContext(): StorefrontContextValue {
  const value = useContext(StorefrontContext);
  if (!value) throw new Error('Vendora hooks must be used inside StorefrontProvider.');
  return value;
}

export function useStorefront(): StorefrontConfig {
  return useStorefrontContext().config;
}

export function useCart(): CartController {
  return useStorefrontContext().cart;
}

export function useFavorites(): FavoritesController {
  return useStorefrontContext().favorites;
}
