# @vendora/core

Provider-independent commerce models and business rules with zero runtime dependencies.

The package deliberately contains no React, DOM, storage, network, payment-provider, deployment,
country, or product-specific code. Import all supported APIs from the package root.

```ts
import { isPaymentConfirmed } from '@vendora/core';
```
