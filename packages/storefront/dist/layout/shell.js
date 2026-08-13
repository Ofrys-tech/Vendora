import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Link, NavLink } from 'react-router';
import { useCart, useFavorites, useStorefront } from '../config/provider';
import { assertSafeUrl } from '../content/security';
export function StorefrontHeader() {
    const config = useStorefront();
    const { cart, openDrawer } = useCart();
    const { favoriteIds } = useFavorites();
    const itemCount = cart.lines.reduce((total, line) => total + line.quantity, 0);
    return (_jsx("header", { className: "vendora-header", children: _jsxs("div", { className: "vendora-header__inner", children: [_jsxs(Link, { className: "vendora-brand", to: config.routes.home, children: [config.brand.logoUrl ? (_jsx("img", { alt: config.brand.logoAlt ?? config.brand.name, className: "vendora-brand__logo", src: assertSafeUrl(config.brand.logoUrl) })) : null, _jsx("span", { children: config.brand.shortName ?? config.brand.name })] }), _jsx("nav", { "aria-label": "Primary", className: "vendora-navigation", children: config.navigation.map((item) => item.external ? (_jsx("a", { href: assertSafeUrl(item.to), rel: "noreferrer", children: item.label }, `${item.label}:${item.to}`)) : (_jsx(NavLink, { to: item.to, children: item.label }, `${item.label}:${item.to}`))) }), _jsxs("div", { className: "vendora-header__actions", children: [config.content?.headerActions, _jsxs(Link, { to: config.routes.favorites, children: ["Favorites (", favoriteIds.length, ")"] }), _jsxs("button", { className: "vendora-cart-trigger", onClick: openDrawer, type: "button", children: ["Cart (", itemCount, ")"] })] })] }) }));
}
export function StorefrontFooter() {
    const config = useStorefront();
    return (_jsx("footer", { className: "vendora-footer", children: _jsxs("div", { className: "vendora-footer__inner", children: [_jsxs("div", { children: [_jsx("strong", { children: config.brand.name }), config.support.map((link) => (_jsx("a", { href: assertSafeUrl(link.url), children: link.label }, link.url)))] }), config.footer.map((section) => (_jsxs("section", { children: [_jsx("h2", { children: section.title }), section.items.map((item) => item.external ? (_jsx("a", { href: assertSafeUrl(item.to), rel: "noreferrer", children: item.label }, `${item.label}:${item.to}`)) : (_jsx(Link, { to: item.to, children: item.label }, `${item.label}:${item.to}`)))] }, section.title)))] }) }));
}
export function StorefrontShell({ children, footer, header }) {
    const { content } = useStorefront();
    return (_jsxs(_Fragment, { children: [header ?? _jsx(StorefrontHeader, {}), _jsx("main", { className: "vendora-main", children: children }), content?.beforeFooter, footer ?? _jsx(StorefrontFooter, {})] }));
}
//# sourceMappingURL=shell.js.map