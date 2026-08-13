# Vendora

Vendora is a provider-independent platform for reliable digital commerce.

The project is developed in public from its domain model outward. The workspace currently contains
the stable core package and a minimal consumer used to verify package boundaries.

## Workspace

- `packages/core`: zero-dependency commerce models and rules published as `@vendora/core`.
- `apps/demo-store`: a neutral runnable consumer of the public core API.
- `docs`: architecture and package-boundary documentation.

## Core installation

Version `v0.1.0` remains available from the repository root for existing consumers:

```bash
pnpm add "@vendora/core@git+https://github.com/Ofrys-tech/Vendora.git#v0.1.0"
```

For commits after the workspace migration, pnpm can install the package from its subdirectory:

```bash
pnpm add "@vendora/core@git+https://github.com/Ofrys-tech/Vendora.git#main&path:/packages/core"
```

Pin a release tag or commit instead of `main` in production. The first workspace release will use
`v0.2.0`; SySphere remains pinned to `v0.1.0` until the new package passes fresh-install checks.

## Development

```bash
pnpm install
pnpm check
pnpm --filter @vendora/demo-store start
```

New packages are added only when they need an independent installation and lifecycle. Domain areas
inside core remain modules, not separate packages.

## License

MIT
