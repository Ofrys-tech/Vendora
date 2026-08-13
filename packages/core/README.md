# @vendora/core

Provider-independent commerce models and business rules with zero runtime dependencies.

The package deliberately contains no React, DOM, storage, network, payment-provider, deployment,
country, or product-specific code. Import all supported APIs from the package root.

Compiled files are committed so pnpm Git subdirectory installs do not require consumer-side build
permissions.

```ts
import { isPaymentConfirmed } from '@vendora/core';
```
