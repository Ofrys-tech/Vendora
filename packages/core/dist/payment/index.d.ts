export type PaymentStatus = 'pending' | 'authorized' | 'paid' | 'failed' | 'cancelled' | 'expired';
export type PaymentMethod = Readonly<{
    id: string;
    label: string;
}>;
export declare const isPaymentConfirmed: (status: PaymentStatus) => boolean;
//# sourceMappingURL=index.d.ts.map