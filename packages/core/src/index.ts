export const CONFIRMED_PAYMENT_STATUSES = ['DELIVERY_FAILED', 'FULFILLED', 'PAID'] as const;

export type ConfirmedPaymentStatus = (typeof CONFIRMED_PAYMENT_STATUSES)[number];

export type CheckoutStage =
  'asset_selection' | 'awaiting_payment' | 'paid' | 'expired' | 'cancelled' | 'manual_review';

export type CheckoutProgress = {
  orderStatus: string;
  pendingItemCount: number;
  paymentStatus: string;
  stage: CheckoutStage;
};

const confirmedPaymentStatusSet = new Set<string>(CONFIRMED_PAYMENT_STATUSES);

export function isPaymentConfirmed(status: Pick<CheckoutProgress, 'paymentStatus'>): boolean {
  return confirmedPaymentStatusSet.has(status.paymentStatus);
}

export function shouldContinueCheckoutPolling(status: CheckoutProgress): boolean {
  if (!isPaymentConfirmed(status)) {
    return status.stage === 'awaiting_payment' || status.stage === 'asset_selection';
  }

  return status.pendingItemCount > 0 && status.orderStatus !== 'FULFILLING';
}
