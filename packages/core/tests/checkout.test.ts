import {
  CheckoutTransitionError,
  isPaymentConfirmed,
  shouldContinueCheckoutPolling,
  shouldPollCheckout,
  transitionCheckout,
  type CheckoutEvent,
  type CheckoutState,
  type CheckoutStatus,
} from '../src/index';
import { describe, expect, it } from 'vitest';

function checkout(status: CheckoutStatus = 'draft'): CheckoutState {
  return {
    deliveryItems: [],
    fulfillmentStatus: 'pending',
    id: 'checkout-1',
    paymentStatus: 'pending',
    status,
  };
}

describe('checkout transitions', () => {
  it.each<[CheckoutStatus, CheckoutEvent, CheckoutStatus]>([
    ['draft', { type: 'checkout_started' }, 'awaiting_payment'],
    ['awaiting_payment', { type: 'payment_confirmed' }, 'payment_confirmed'],
    ['awaiting_payment', { type: 'payment_failed' }, 'failed'],
    ['payment_confirmed', { type: 'fulfillment_started' }, 'fulfilling'],
    ['payment_confirmed', { type: 'manual_review_required' }, 'manual_review'],
    ['fulfilling', { type: 'manual_review_required' }, 'manual_review'],
    ['awaiting_payment', { type: 'cancelled' }, 'cancelled'],
    ['awaiting_payment', { type: 'expired' }, 'expired'],
  ])('%s + %s -> %s', (from, event, to) => {
    expect(transitionCheckout(checkout(from), event).status).toBe(to);
  });

  it('attaches delivery when fulfillment completes', () => {
    const state = transitionCheckout(checkout('fulfilling'), {
      type: 'fulfillment_completed',
      deliveryItems: [{ id: 'delivery-1', secret: 'TEST-KEY', title: 'Test license' }],
    });
    expect(state).toMatchObject({ fulfillmentStatus: 'fulfilled', status: 'fulfilled' });
    expect(state.deliveryItems[0]?.secret).toBe('TEST-KEY');
  });

  it('treats repeated events as idempotent', () => {
    const state = checkout('awaiting_payment');
    expect(transitionCheckout(state, { type: 'checkout_started' })).toBe(state);
  });

  it.each(['fulfilled', 'failed', 'cancelled', 'expired'] as const)(
    'rejects events after terminal state %s',
    (status) => {
      expect(() => transitionCheckout(checkout(status), { type: 'checkout_started' })).toThrow(
        CheckoutTransitionError,
      );
    },
  );

  it('polls only non-terminal asynchronous states', () => {
    expect(shouldPollCheckout(checkout('awaiting_payment'))).toBe(true);
    expect(shouldPollCheckout(checkout('fulfilling'))).toBe(true);
    expect(shouldPollCheckout(checkout('manual_review'))).toBe(false);
    expect(shouldPollCheckout(checkout('fulfilled'))).toBe(false);
  });
});

describe('legacy checkout progress compatibility', () => {
  const progress = {
    orderStatus: 'AWAITING_PAYMENT',
    paymentStatus: 'PENDING',
    pendingItemCount: 0,
    stage: 'awaiting_payment',
  } as const;

  it('accepts the status object used by v0.1 consumers', () => {
    expect(isPaymentConfirmed({ paymentStatus: 'PAID' })).toBe(true);
    expect(isPaymentConfirmed({ paymentStatus: 'DELIVERY_FAILED' })).toBe(true);
  });

  it('preserves the v0.1 polling rules', () => {
    expect(shouldContinueCheckoutPolling(progress)).toBe(true);
    expect(
      shouldContinueCheckoutPolling({
        ...progress,
        orderStatus: 'FULFILLING',
        paymentStatus: 'PAID',
        pendingItemCount: 1,
        stage: 'manual_review',
      }),
    ).toBe(false);
  });
});
