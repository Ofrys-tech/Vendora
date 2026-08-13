import { shouldContinueCheckoutPolling, type CheckoutProgress } from '@vendora/core';

export const demoCheckout: CheckoutProgress = {
  orderStatus: 'AWAITING_PAYMENT',
  paymentStatus: 'PENDING',
  pendingItemCount: 0,
  stage: 'awaiting_payment',
};

export function describeDemoStore() {
  return {
    name: 'Vendora Demo Store',
    polling: shouldContinueCheckoutPolling(demoCheckout),
    status: demoCheckout.stage,
  };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  console.log(JSON.stringify(describeDemoStore()));
}
