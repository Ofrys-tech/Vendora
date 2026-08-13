import { expect, test, type Page } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/catalog');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

async function checkout(page: Page, method: string) {
  await page.getByRole('button', { name: 'Add to cart' }).first().click();
  await page.getByRole('button', { name: 'Cart (1)' }).click();
  await page.getByRole('link', { name: 'View cart' }).click();
  await page.getByRole('link', { name: 'Checkout' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill('demo@example.test');
  await page.getByRole('radio', { name: new RegExp(method, 'i') }).check();
  await page.getByRole('button', { name: 'Continue' }).click();
  await page.getByRole('link', { name: 'Continue to payment' }).click();
  await page.getByRole('button', { name: 'Complete test payment' }).click();
}

test('successful payment delivers a test license', async ({ page }) => {
  await checkout(page, 'Successful');
  await expect(page.getByRole('heading', { name: 'Delivered' })).toBeVisible();
  await expect(page.getByText('DEMO-ONLY-TEST-LICENSE')).toBeVisible();
});

test('pending payment remains pollable', async ({ page }) => {
  await checkout(page, 'Pending');
  await expect(page.getByRole('heading', { name: 'Awaiting payment' })).toBeVisible();
});

test('failed payment reaches a terminal state', async ({ page }) => {
  await checkout(page, 'Failed');
  await expect(page.getByRole('heading', { name: 'Failed' })).toBeVisible();
});

test('manual review explains pending fulfillment', async ({ page }) => {
  await checkout(page, 'Manual');
  await expect(page.getByRole('heading', { name: 'Manual review' })).toBeVisible();
  await expect(page.getByText(/operator would continue/)).toBeVisible();
});
