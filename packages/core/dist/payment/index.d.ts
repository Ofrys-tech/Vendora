export type PaymentStatus = 'pending' | 'authorized' | 'paid' | 'failed' | 'cancelled' | 'expired';
export type PaymentMethod = Readonly<{
    id: string;
    label: string;
}>;
export declare function isPaymentConfirmed(status: PaymentStatus | Readonly<{
    paymentStatus: string;
}>): boolean;
//# sourceMappingURL=index.d.ts.map