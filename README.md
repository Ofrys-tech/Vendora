# Vendora Core

Vendora Core is a provider-independent foundation for reliable digital commerce.

The project is being developed in public from its domain model outward. It deliberately does not
contain a storefront, payment-provider SDK, database, deployment platform, country-specific rules,
or product-specific logic.

## Current scope

- shared checkout lifecycle types;
- payment confirmation rules;
- checkout polling decisions;
- zero runtime dependencies.

## Installation

During early development, install the package directly from GitHub:

```bash
pnpm add "@vendora/core@git+https://github.com/Ofrys-tech/Vendora.git#v0.1.0"
```

The public API is exported from `src/index.ts` and compiled to `dist/` when installed from Git.

## Development

```bash
pnpm install
pnpm check
```

Vendora Core is intentionally small. New modules are added only after their domain boundaries and
behavior are defined by tests.

## License

MIT
