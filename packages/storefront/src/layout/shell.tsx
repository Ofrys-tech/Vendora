import type { ReactNode } from 'react';
import { Link, NavLink } from 'react-router';
import { useCart, useFavorites, useStorefront } from '../config/provider';
import { assertSafeUrl } from '../content/security';

export function StorefrontHeader() {
  const config = useStorefront();
  const { cart, openDrawer } = useCart();
  const { favoriteIds } = useFavorites();
  const itemCount = cart.lines.reduce((total, line) => total + line.quantity, 0);

  return (
    <header className="vendora-header">
      <div className="vendora-header__inner">
        <Link className="vendora-brand" to={config.routes.home}>
          {config.brand.logoUrl ? (
            <img
              alt={config.brand.logoAlt ?? config.brand.name}
              className="vendora-brand__logo"
              src={assertSafeUrl(config.brand.logoUrl)}
            />
          ) : null}
          <span>{config.brand.shortName ?? config.brand.name}</span>
        </Link>
        <nav aria-label="Primary" className="vendora-navigation">
          {config.navigation.map((item) =>
            item.external ? (
              <a href={assertSafeUrl(item.to)} key={`${item.label}:${item.to}`} rel="noreferrer">
                {item.label}
              </a>
            ) : (
              <NavLink key={`${item.label}:${item.to}`} to={item.to}>
                {item.label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="vendora-header__actions">
          {config.content?.headerActions}
          <Link to={config.routes.favorites}>Favorites ({favoriteIds.length})</Link>
          <button className="vendora-cart-trigger" onClick={openDrawer} type="button">
            Cart ({itemCount})
          </button>
        </div>
      </div>
    </header>
  );
}

export function StorefrontFooter() {
  const config = useStorefront();
  return (
    <footer className="vendora-footer">
      <div className="vendora-footer__inner">
        <div>
          <strong>{config.brand.name}</strong>
          {config.support.map((link) => (
            <a href={assertSafeUrl(link.url)} key={link.url}>
              {link.label}
            </a>
          ))}
        </div>
        {config.footer.map((section) => (
          <section key={section.title}>
            <h2>{section.title}</h2>
            {section.items.map((item) =>
              item.external ? (
                <a href={assertSafeUrl(item.to)} key={`${item.label}:${item.to}`} rel="noreferrer">
                  {item.label}
                </a>
              ) : (
                <Link key={`${item.label}:${item.to}`} to={item.to}>
                  {item.label}
                </Link>
              ),
            )}
          </section>
        ))}
      </div>
    </footer>
  );
}

export type StorefrontShellProps = Readonly<{
  children: ReactNode;
  footer?: ReactNode;
  header?: ReactNode;
}>;

export function StorefrontShell({ children, footer, header }: StorefrontShellProps) {
  const { content } = useStorefront();
  return (
    <>
      {header ?? <StorefrontHeader />}
      <main className="vendora-main">{children}</main>
      {content?.beforeFooter}
      {footer ?? <StorefrontFooter />}
    </>
  );
}
