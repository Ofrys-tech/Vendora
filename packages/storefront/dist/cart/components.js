import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { cartTotal } from '@vendora/core';
import { useCart, useStorefront } from '../config/provider';
import { Button, ButtonLink, EmptyState, PageHero } from '../layout/primitives';
function useCartProducts() {
    const { catalog } = useStorefront();
    return new Map(catalog.products.map((product) => [product.id, product]));
}
export function CartLines() {
    const { cart, remove, update } = useCart();
    const { formatMoney } = useStorefront();
    const products = useCartProducts();
    return (_jsx("div", { className: "vendora-cart-lines", children: cart.lines.map((line) => {
            const product = products.get(line.productId);
            if (!product)
                return null;
            return (_jsxs("article", { className: "vendora-cart-line", children: [_jsxs("div", { children: [_jsx("h3", { children: product.name }), _jsx("span", { children: formatMoney(line.unitPrice) })] }), _jsxs("label", { children: ["Quantity", _jsx("input", { "aria-label": `Quantity for ${product.name}`, max: product.maxQuantity, min: "1", onChange: (event) => update(product, Number(event.currentTarget.value)), type: "number", value: line.quantity })] }), _jsx(Button, { onClick: () => remove(product.id), variant: "ghost", children: "Remove" })] }, line.productId));
        }) }));
}
export function CartSummary({ actions }) {
    const { cart } = useCart();
    const { formatMoney } = useStorefront();
    if (!cart.lines.length)
        return null;
    return (_jsxs("aside", { className: "vendora-cart-summary", children: [_jsx("span", { children: "Total" }), _jsx("strong", { children: formatMoney(cartTotal(cart)) }), actions] }));
}
export function CartDrawer() {
    const { cart, clear, closeDrawer, drawerOpen } = useCart();
    const { routes } = useStorefront();
    if (!drawerOpen)
        return null;
    return (_jsxs("div", { "aria-label": "Shopping cart", "aria-modal": "true", className: "vendora-drawer", role: "dialog", children: [_jsxs("div", { className: "vendora-drawer__header", children: [_jsx("h2", { children: "Cart" }), _jsx(Button, { "aria-label": "Close cart", onClick: closeDrawer, variant: "ghost", children: "Close" })] }), cart.lines.length ? (_jsxs(_Fragment, { children: [_jsx(CartLines, {}), _jsx(CartSummary, { actions: _jsxs(_Fragment, { children: [_jsx(ButtonLink, { onClick: closeDrawer, to: routes.cart, children: "View cart" }), _jsx(Button, { onClick: clear, variant: "ghost", children: "Clear cart" })] }) })] })) : (_jsx(EmptyState, { title: "Your cart is empty" }))] }));
}
export function CartPageTemplate({ description, title = 'Your cart' }) {
    const { cart, clear } = useCart();
    const { routes } = useStorefront();
    return (_jsxs("section", { className: "vendora-page vendora-cart-page", children: [_jsx(PageHero, { description: description, title: title }), cart.lines.length ? (_jsxs("div", { className: "vendora-cart-layout", children: [_jsxs("div", { children: [_jsx(CartLines, {}), _jsx(Button, { onClick: clear, variant: "ghost", children: "Clear cart" })] }), _jsx(CartSummary, { actions: _jsx(ButtonLink, { to: routes.checkout, children: "Checkout" }) })] })) : (_jsx(EmptyState, { action: _jsx(ButtonLink, { to: routes.catalog, children: "Browse catalog" }), title: "Your cart is empty" }))] }));
}
//# sourceMappingURL=components.js.map