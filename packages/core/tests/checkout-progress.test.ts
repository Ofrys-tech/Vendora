import {
  isPaymentConfirmed,
  shouldContinueCheckoutPolling,
  type CheckoutProgress,
} from '../src/index';
import { describe, expect, it } from 'vitest';

function checkoutProgress(overrides: Partial<CheckoutProgress> = {}): CheckoutProgress {
  return {
    orderStatus: 'AWAITING_PAYMENT',
    paymentStatus: 'PENDING',
    pendingItemCount: 0,
    stage: 'awaiting_payment',
    ...overrides,
  };
}

describe('checkout progress', () => {
  it.each(['PAID', 'FULFILLED', 'DELIVERY_FAILED'])('%s confirms payment', (paymentStatus) => {
    expect(isPaymentConfirmed(checkoutProgress({ paymentStatus }))).toBe(true);
  });

  it('keeps polling while payment confirmation is pending', () => {
    expect(shouldContinueCheckoutPolling(checkoutProgress())).toBe(true);
  });

  it('keeps polling confirmed orders while automatic delivery is pending', () => {
    expect(
      shouldContinueCheckoutPolling(
        checkoutProgress({
          orderStatus: 'PAID',
          paymentStatus: 'PAID',
          pendingItemCount: 1,
          stage: 'paid',
        }),
      ),
    ).toBe(true);
  });

  it('stops polling when fulfillment requires manual work', () => {
    expect(
      shouldContinueCheckoutPolling(
        checkoutProgress({
          orderStatus: 'FULFILLING',
          paymentStatus: 'PAID',
          pendingItemCount: 1,
          stage: 'manual_review',
        }),
      ),
    ).toBe(false);
  });
});
