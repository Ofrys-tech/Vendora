import { addCartItem, emptyCart } from '@vendora/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { demoProducts } from '../../src/catalog';
import { completeDemoPayment, demoCheckoutClient } from '../../src/fake-checkout';

describe('fake checkout gateway', () => {
  beforeEach(() => vi.spyOn(Date, 'now').mockReturnValue(1_723_500_000_000));

  it('moves a local checkout to delivered state', async () => {
    const cart = addCartItem(emptyCart(), demoProducts[0]!);
    const result = await demoCheckoutClient.startCheckout({
      cart,
      customerEmail: 'demo@example.test',
      paymentMethodId: 'success',
    });

    completeDemoPayment(result.checkout.id, 'success');

    await expect(demoCheckoutClient.getCheckoutStatus(result.checkout.id)).resolves.toMatchObject({
      deliveryItems: [{ secret: 'DEMO-ONLY-TEST-LICENSE' }],
      paymentStatus: 'paid',
      status: 'fulfilled',
    });
    expect(result.total).toEqual({ amountMinor: 1200, currency: 'USD' });
  });

  it.each([
    ['pending', 'awaiting_payment'],
    ['failed', 'failed'],
    ['manual', 'manual_review'],
  ] as const)('exposes the %s scenario', async (scenario, status) => {
    const cart = addCartItem(emptyCart(), demoProducts[0]!);
    const result = await demoCheckoutClient.startCheckout({
      cart,
      customerEmail: 'demo@example.test',
      paymentMethodId: scenario,
    });

    completeDemoPayment(result.checkout.id, scenario);

    await expect(demoCheckoutClient.getCheckoutStatus(result.checkout.id)).resolves.toMatchObject({
      status,
    });
  });
});
