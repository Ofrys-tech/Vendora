export type PaymentStatus = 'pending' | 'authorized' | 'paid' | 'failed' | 'cancelled' | 'expired';

export type PaymentMethod = Readonly<{
  id: string;
  label: string;
}>;

const confirmedPaymentStatuses = new Set(['DELIVERY_FAILED', 'FULFILLED', 'PAID', 'paid']);

export function isPaymentConfirmed(
  status: PaymentStatus | Readonly<{ paymentStatus: string }>,
): boolean {
  return confirmedPaymentStatuses.has(typeof status === 'string' ? status : status.paymentStatus);
}
