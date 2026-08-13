import type { CheckoutState, DeliveryItem, StartCheckoutResult } from '@vendora/core';
import { useState, type FormEvent, type ReactNode } from 'react';
import { useCart, useStorefront } from '../config/provider';
import { assertSafeUrl } from '../content/security';
import { Button, ButtonLink, EmptyState, PageHero } from '../layout/primitives';

const checkoutStatusLabels: Record<CheckoutState['status'], string> = {
  awaiting_payment: 'Awaiting payment',
  cancelled: 'Cancelled',
  draft: 'Draft',
  expired: 'Expired',
  failed: 'Failed',
  fulfilled: 'Delivered',
  fulfilling: 'Preparing delivery',
  manual_review: 'Manual review',
  payment_confirmed: 'Payment confirmed',
};

export function CheckoutStatus({ checkout }: Readonly<{ checkout: CheckoutState }>) {
  return (
    <section aria-live="polite" className="vendora-checkout-status" data-status={checkout.status}>
      <p className="vendora-eyebrow">Checkout {checkout.id}</p>
      <h2>{checkoutStatusLabels[checkout.status]}</h2>
      <p>Payment: {checkout.paymentStatus.replaceAll('_', ' ')}</p>
      <p>Delivery: {checkout.fulfillmentStatus.replaceAll('_', ' ')}</p>
    </section>
  );
}

export function DeliveryList({ items }: Readonly<{ items: readonly DeliveryItem[] }>) {
  if (!items.length) return null;
  return (
    <section className="vendora-delivery">
      <h2>Delivery</h2>
      <div className="vendora-delivery__items">
        {items.map((item) => (
          <article key={item.id}>
            <h3>{item.title}</h3>
            {item.secret ? <code>{item.secret}</code> : null}
            {item.instructions ? <p>{item.instructions}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
}

export type CheckoutPageTemplateProps = Readonly<{
  description?: ReactNode;
  onStarted?: (result: StartCheckoutResult) => void;
  title?: ReactNode;
}>;

export function CheckoutPageTemplate({
  description,
  onStarted,
  title = 'Checkout',
}: CheckoutPageTemplateProps) {
  const { cart } = useCart();
  const config = useStorefront();
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentMethodId, setPaymentMethodId] = useState(config.paymentMethods[0]?.id ?? '');
  const [result, setResult] = useState<StartCheckoutResult | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const next = await config.checkoutClient.startCheckout({
        cart,
        customerEmail,
        paymentMethodId,
      });
      if (next.paymentUrl) assertSafeUrl(next.paymentUrl);
      setResult(next);
      onStarted?.(next);
    } catch (cause) {
      setError(cause instanceof Error ? cause : new Error('Unable to start checkout.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (!cart.lines.length) {
    return (
      <section className="vendora-page vendora-checkout-page">
        <PageHero description={description} title={title} />
        <EmptyState
          action={<ButtonLink to={config.routes.catalog}>Browse catalog</ButtonLink>}
          title="Add a product before checkout"
        />
      </section>
    );
  }

  return (
    <section className="vendora-page vendora-checkout-page">
      <PageHero description={description} title={title} />
      {result ? (
        <>
          <CheckoutStatus checkout={result.checkout} />
          {result.paymentUrl ? (
            <a
              className="vendora-button vendora-button--primary"
              href={assertSafeUrl(result.paymentUrl)}
            >
              Continue to payment
            </a>
          ) : null}
          <DeliveryList items={result.checkout.deliveryItems} />
        </>
      ) : (
        <form className="vendora-checkout-form" onSubmit={submit}>
          <label>
            Email
            <input
              autoComplete="email"
              onChange={(event) => setCustomerEmail(event.currentTarget.value)}
              required
              type="email"
              value={customerEmail}
            />
          </label>
          <fieldset>
            <legend>Payment method</legend>
            {config.paymentMethods.map((method) => (
              <label key={method.id}>
                <input
                  checked={paymentMethodId === method.id}
                  name="paymentMethod"
                  onChange={() => setPaymentMethodId(method.id)}
                  required
                  type="radio"
                  value={method.id}
                />
                <span>
                  <strong>{method.label}</strong>
                  {method.description ? <small>{method.description}</small> : null}
                </span>
              </label>
            ))}
          </fieldset>
          {error ? <p role="alert">{error.message}</p> : null}
          <Button disabled={submitting || !paymentMethodId} type="submit">
            {submitting ? 'Starting checkout...' : 'Continue'}
          </Button>
        </form>
      )}
    </section>
  );
}

export type CheckoutStatusPageTemplateProps = Readonly<{
  checkout: CheckoutState;
  description?: ReactNode;
  title?: ReactNode;
}>;

export function CheckoutStatusPageTemplate({
  checkout,
  description,
  title = 'Order status',
}: CheckoutStatusPageTemplateProps) {
  return (
    <section className="vendora-page vendora-checkout-page">
      <PageHero description={description} title={title} />
      <CheckoutStatus checkout={checkout} />
      <DeliveryList items={checkout.deliveryItems} />
    </section>
  );
}
