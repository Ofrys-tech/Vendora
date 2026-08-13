import {
  cartTotal,
  type CheckoutClient,
  type CheckoutState,
  type StartCheckoutCommand,
  type StartCheckoutResult,
} from '@vendora/core';

export type DemoScenario = 'success' | 'pending' | 'failed' | 'manual';

const storageKey = (checkoutId: string) => `northstar-demo:checkout:${checkoutId}`;

function checkoutState(checkoutId: string, scenario: DemoScenario): CheckoutState {
  if (scenario === 'failed') {
    return {
      deliveryItems: [],
      fulfillmentStatus: 'pending',
      id: checkoutId,
      paymentStatus: 'failed',
      status: 'failed',
    };
  }

  if (scenario === 'manual') {
    return {
      deliveryItems: [],
      fulfillmentStatus: 'manual_review',
      id: checkoutId,
      paymentStatus: 'paid',
      status: 'manual_review',
    };
  }

  if (scenario === 'success') {
    return {
      deliveryItems: [
        {
          id: 'demo-delivery',
          instructions: 'This value is generated only for the local demonstration.',
          secret: 'DEMO-ONLY-TEST-LICENSE',
          title: 'Your test delivery',
        },
      ],
      fulfillmentStatus: 'fulfilled',
      id: checkoutId,
      paymentStatus: 'paid',
      status: 'fulfilled',
    };
  }

  return {
    deliveryItems: [],
    fulfillmentStatus: 'pending',
    id: checkoutId,
    paymentStatus: 'pending',
    status: 'awaiting_payment',
  };
}

export function completeDemoPayment(checkoutId: string, scenario: DemoScenario): void {
  sessionStorage.setItem(
    storageKey(checkoutId),
    JSON.stringify(checkoutState(checkoutId, scenario)),
  );
}

export const demoCheckoutClient: CheckoutClient = {
  async startCheckout(command: StartCheckoutCommand): Promise<StartCheckoutResult> {
    const checkoutId = `demo-${Date.now()}`;
    const scenario = command.paymentMethodId as DemoScenario;
    const checkout = checkoutState(checkoutId, 'pending');
    sessionStorage.setItem(storageKey(checkoutId), JSON.stringify(checkout));

    return {
      checkout,
      paymentUrl: `/payment/${checkoutId}?scenario=${scenario}`,
      total: cartTotal(command.cart),
    };
  },

  async getCheckoutStatus(checkoutId: string): Promise<CheckoutState> {
    const stored = sessionStorage.getItem(storageKey(checkoutId));
    if (!stored) throw new Error('Demo checkout not found.');
    return JSON.parse(stored) as CheckoutState;
  },
};
