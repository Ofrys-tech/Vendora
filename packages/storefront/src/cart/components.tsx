import { cartTotal, type Product } from '@vendora/core';
import type { ReactNode } from 'react';
import { useCart, useStorefront } from '../config/provider.js';
import { Button, ButtonLink, EmptyState, PageHero } from '../layout/primitives.js';

function useCartProducts(): Map<string, Product> {
  const { catalog } = useStorefront();
  return new Map(catalog.products.map((product) => [product.id, product]));
}

export function CartLines() {
  const { cart, remove, update } = useCart();
  const { formatMoney } = useStorefront();
  const products = useCartProducts();

  return (
    <div className="vendora-cart-lines">
      {cart.lines.map((line) => {
        const product = products.get(line.productId);
        if (!product) return null;
        return (
          <article className="vendora-cart-line" key={line.productId}>
            <div>
              <h3>{product.name}</h3>
              <span>{formatMoney(line.unitPrice)}</span>
            </div>
            <label>
              Quantity
              <input
                aria-label={`Quantity for ${product.name}`}
                max={product.maxQuantity}
                min="1"
                onChange={(event) => update(product, Number(event.currentTarget.value))}
                type="number"
                value={line.quantity}
              />
            </label>
            <Button onClick={() => remove(product.id)} variant="ghost">
              Remove
            </Button>
          </article>
        );
      })}
    </div>
  );
}

export type CartSummaryProps = Readonly<{ actions?: ReactNode }>;

export function CartSummary({ actions }: CartSummaryProps) {
  const { cart } = useCart();
  const { formatMoney } = useStorefront();
  if (!cart.lines.length) return null;
  return (
    <aside className="vendora-cart-summary">
      <span>Total</span>
      <strong>{formatMoney(cartTotal(cart))}</strong>
      {actions}
    </aside>
  );
}

export function CartDrawer() {
  const { cart, clear, closeDrawer, drawerOpen } = useCart();
  const { routes } = useStorefront();
  if (!drawerOpen) return null;
  return (
    <div aria-label="Shopping cart" aria-modal="true" className="vendora-drawer" role="dialog">
      <div className="vendora-drawer__header">
        <h2>Cart</h2>
        <Button aria-label="Close cart" onClick={closeDrawer} variant="ghost">
          Close
        </Button>
      </div>
      {cart.lines.length ? (
        <>
          <CartLines />
          <CartSummary
            actions={
              <>
                <ButtonLink onClick={closeDrawer} to={routes.cart}>
                  View cart
                </ButtonLink>
                <Button onClick={clear} variant="ghost">
                  Clear cart
                </Button>
              </>
            }
          />
        </>
      ) : (
        <EmptyState title="Your cart is empty" />
      )}
    </div>
  );
}

export type CartPageTemplateProps = Readonly<{
  description?: ReactNode;
  title?: ReactNode;
}>;

export function CartPageTemplate({ description, title = 'Your cart' }: CartPageTemplateProps) {
  const { cart, clear } = useCart();
  const { routes } = useStorefront();
  return (
    <section className="vendora-page vendora-cart-page">
      <PageHero description={description} title={title} />
      {cart.lines.length ? (
        <div className="vendora-cart-layout">
          <div>
            <CartLines />
            <Button onClick={clear} variant="ghost">
              Clear cart
            </Button>
          </div>
          <CartSummary actions={<ButtonLink to={routes.checkout}>Checkout</ButtonLink>} />
        </div>
      ) : (
        <EmptyState
          action={<ButtonLink to={routes.catalog}>Browse catalog</ButtonLink>}
          title="Your cart is empty"
        />
      )}
    </section>
  );
}
