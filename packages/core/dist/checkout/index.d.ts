import type { Cart } from '../cart/index.js';
import type { DeliveryItem, FulfillmentStatus } from '../fulfillment/index.js';
import type { Money } from '../money.js';
import type { PaymentStatus } from '../payment/index.js';
export type CheckoutStage = 'asset_selection' | 'awaiting_payment' | 'paid' | 'expired' | 'cancelled' | 'manual_review';
export type CheckoutProgress = Readonly<{
    orderStatus: string;
    paymentStatus: string;
    pendingItemCount: number;
    stage: CheckoutStage;
}>;
export declare function shouldContinueCheckoutPolling(status: CheckoutProgress): boolean;
export type CheckoutStatus = 'draft' | 'awaiting_payment' | 'payment_confirmed' | 'fulfilling' | 'fulfilled' | 'manual_review' | 'failed' | 'cancelled' | 'expired';
export type CheckoutState = Readonly<{
    deliveryItems: readonly DeliveryItem[];
    fulfillmentStatus: FulfillmentStatus;
    id: string;
    paymentStatus: PaymentStatus;
    status: CheckoutStatus;
}>;
export type CheckoutEvent = {
    type: 'checkout_started';
} | {
    type: 'payment_confirmed';
} | {
    type: 'payment_failed';
} | {
    type: 'fulfillment_started';
} | {
    type: 'fulfillment_completed';
    deliveryItems: readonly DeliveryItem[];
} | {
    type: 'manual_review_required';
} | {
    type: 'cancelled';
} | {
    type: 'expired';
};
export declare const TERMINAL_CHECKOUT_STATUSES: readonly ["fulfilled", "failed", "cancelled", "expired"];
export declare class CheckoutTransitionError extends Error {
    constructor(status: CheckoutStatus, event: CheckoutEvent['type']);
}
export declare function transitionCheckout(state: CheckoutState, event: CheckoutEvent): CheckoutState;
export declare const shouldPollCheckout: (state: CheckoutState) => boolean;
export type StartCheckoutCommand = Readonly<{
    cart: Cart;
    customerEmail: string;
    paymentMethodId: string;
}>;
export type StartCheckoutResult = Readonly<{
    checkout: CheckoutState;
    paymentUrl: string | null;
    total: Money;
}>;
export interface CheckoutGateway {
    startCheckout(command: StartCheckoutCommand): Promise<StartCheckoutResult>;
    getCheckoutStatus(checkoutId: string): Promise<CheckoutState>;
}
export interface CheckoutClient extends CheckoutGateway {
}
//# sourceMappingURL=index.d.ts.map