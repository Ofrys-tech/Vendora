export type PaymentStatus = 'pending' | 'authorized' | 'paid' | 'failed' | 'cancelled' | 'expired';

export type PaymentMethod = Readonly<{
  id: string;
  label: string;
}>;

export const isPaymentConfirmed = (status: PaymentStatus): boolean => status === 'paid';
