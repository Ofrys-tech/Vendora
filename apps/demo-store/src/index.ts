import { shouldPollCheckout, type CheckoutState } from '@vendora/core';

export const demoCheckout: CheckoutState = {
  deliveryItems: [],
  fulfillmentStatus: 'pending',
  id: 'demo-checkout',
  paymentStatus: 'pending',
  status: 'awaiting_payment',
};

export function describeDemoStore() {
  return {
    name: 'Vendora Demo Store',
    polling: shouldPollCheckout(demoCheckout),
    status: demoCheckout.status,
  };
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  console.log(JSON.stringify(describeDemoStore()));
}
