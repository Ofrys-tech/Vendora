export const CONFIRMED_PAYMENT_STATUSES = ['DELIVERY_FAILED', 'FULFILLED', 'PAID'];
const confirmedPaymentStatusSet = new Set(CONFIRMED_PAYMENT_STATUSES);
export function isPaymentConfirmed(status) {
    return confirmedPaymentStatusSet.has(status.paymentStatus);
}
export function shouldContinueCheckoutPolling(status) {
    if (!isPaymentConfirmed(status)) {
        return status.stage === 'awaiting_payment' || status.stage === 'asset_selection';
    }
    return status.pendingItemCount > 0 && status.orderStatus !== 'FULFILLING';
}
//# sourceMappingURL=index.js.map