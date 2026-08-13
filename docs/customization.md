# Customization

The demo store uses only public APIs from `@vendora/core` and `@vendora/storefront`.

## Catalog

Replace `apps/demo-store/src/catalog.ts` with application-owned `Category` and `Product` values.
Money is expressed in integer minor units. Keep private catalogs outside public packages.

## Theme

Set semantic values in `StorefrontConfig.theme`, import `@vendora/storefront/styles.css`, then add an
application stylesheet after it for brand-specific composition and assets.

## Checkout Gateway

Implement the `CheckoutClient` interface and pass it as `checkoutClient`. `startCheckout` creates a
checkout and optional payment URL; `getCheckoutStatus` returns canonical states. Provider names,
credentials, raw statuses, and HTTP details belong in the application adapter.

## Delivery

Map provider fulfillment output to `DeliveryItem`. The storefront renders plain titles,
instructions, and secrets. HTML content must use `SafeHtml`, and every URL must pass `isSafeUrl`.
