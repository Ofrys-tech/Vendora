export declare const CONFIRMED_PAYMENT_STATUSES: readonly ["DELIVERY_FAILED", "FULFILLED", "PAID"];
export type ConfirmedPaymentStatus = (typeof CONFIRMED_PAYMENT_STATUSES)[number];
export type CheckoutStage = 'asset_selection' | 'awaiting_payment' | 'paid' | 'expired' | 'cancelled' | 'manual_review';
export type CheckoutProgress = {
    orderStatus: string;
    pendingItemCount: number;
    paymentStatus: string;
    stage: CheckoutStage;
};
export declare function isPaymentConfirmed(status: Pick<CheckoutProgress, 'paymentStatus'>): boolean;
export declare function shouldContinueCheckoutPolling(status: CheckoutProgress): boolean;
//# sourceMappingURL=index.d.ts.map