# @vendora/storefront

Configurable React components, hooks, and page templates for Vendora storefronts.

The package does not define application routes or metadata. Consumers provide a
`StorefrontConfig`, compose exported templates inside their own route tree, and import the default
styles separately.

```tsx
import { StorefrontProvider, StorefrontShell } from '@vendora/storefront';
import '@vendora/storefront/styles.css';

<StorefrontProvider config={config}>
  <StorefrontShell>{children}</StorefrontShell>
</StorefrontProvider>;
```

HTML content must pass through `SafeHtml` or `sanitizeHtml`. External links supplied by consumers
are validated by the config boundary.
