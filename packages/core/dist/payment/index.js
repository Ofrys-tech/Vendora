const confirmedPaymentStatuses = new Set(['DELIVERY_FAILED', 'FULFILLED', 'PAID', 'paid']);
export function isPaymentConfirmed(status) {
    return confirmedPaymentStatuses.has(typeof status === 'string' ? status : status.paymentStatus);
}
//# sourceMappingURL=index.js.map