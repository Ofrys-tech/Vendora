# Architecture

Vendora is a small workspace with one dependency direction:

```text
apps/demo-store -> packages/core
```

`@vendora/core` owns provider-independent models and pure business rules. It must not depend on
React, browser APIs, persistence, HTTP clients, payment providers, deployment platforms, country
rules, private catalogs, or consumer applications.

The demo application imports only the public package entry point. It exists to prove that packaged
APIs can be consumed without reaching into source internals. A separate `@vendora/storefront`
package will be introduced only when the reusable React boundary is implemented.

New domain areas remain modules inside core. A new package requires a distinct installation method
and release lifecycle.
