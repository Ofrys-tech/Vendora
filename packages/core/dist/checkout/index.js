export const TERMINAL_CHECKOUT_STATUSES = ['fulfilled', 'failed', 'cancelled', 'expired'];
const eventTargets = {
    checkout_started: 'awaiting_payment',
    payment_confirmed: 'payment_confirmed',
    payment_failed: 'failed',
    fulfillment_started: 'fulfilling',
    fulfillment_completed: 'fulfilled',
    manual_review_required: 'manual_review',
    cancelled: 'cancelled',
    expired: 'expired',
};
const allowedEvents = {
    draft: ['checkout_started', 'cancelled'],
    awaiting_payment: ['payment_confirmed', 'payment_failed', 'cancelled', 'expired'],
    payment_confirmed: ['fulfillment_started', 'manual_review_required'],
    fulfilling: ['fulfillment_completed', 'manual_review_required'],
    manual_review: ['fulfillment_started', 'fulfillment_completed'],
    fulfilled: [],
    failed: [],
    cancelled: [],
    expired: [],
};
export class CheckoutTransitionError extends Error {
    constructor(status, event) {
        super(`Cannot apply ${event} to checkout in ${status}.`);
        this.name = 'CheckoutTransitionError';
    }
}
export function transitionCheckout(state, event) {
    const target = eventTargets[event.type];
    if (state.status === target)
        return state;
    if (!allowedEvents[state.status].includes(event.type)) {
        throw new CheckoutTransitionError(state.status, event.type);
    }
    if (event.type === 'payment_confirmed') {
        return { ...state, paymentStatus: 'paid', status: target };
    }
    if (event.type === 'payment_failed') {
        return { ...state, paymentStatus: 'failed', status: target };
    }
    if (event.type === 'fulfillment_started') {
        return { ...state, fulfillmentStatus: 'processing', status: target };
    }
    if (event.type === 'fulfillment_completed') {
        return {
            ...state,
            deliveryItems: [...event.deliveryItems],
            fulfillmentStatus: 'fulfilled',
            status: target,
        };
    }
    if (event.type === 'manual_review_required') {
        return { ...state, fulfillmentStatus: 'manual_review', status: target };
    }
    if (event.type === 'expired')
        return { ...state, paymentStatus: 'expired', status: target };
    if (event.type === 'cancelled')
        return { ...state, paymentStatus: 'cancelled', status: target };
    return { ...state, status: target };
}
export const shouldPollCheckout = (state) => state.status === 'awaiting_payment' ||
    state.status === 'payment_confirmed' ||
    state.status === 'fulfilling';
//# sourceMappingURL=index.js.map