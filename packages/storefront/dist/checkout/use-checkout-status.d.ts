import { type CheckoutState } from '@vendora/core';
export type CheckoutStatusController = Readonly<{
    checkout: CheckoutState | null;
    error: Error | null;
    loading: boolean;
    refresh: () => Promise<void>;
}>;
export type CheckoutStatusOptions = Readonly<{
    pollIntervalMs?: number;
}>;
export declare function useCheckoutStatus(checkoutId: string | null, options?: CheckoutStatusOptions): CheckoutStatusController;
//# sourceMappingURL=use-checkout-status.d.ts.map