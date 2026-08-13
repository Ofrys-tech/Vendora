import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCart, useFavorites, useStorefront } from '../config/provider';
import { Button, PageHero } from '../layout/primitives';
import { sanitizeHtml } from './security';
export function SafeHtml({ as: Element = 'div', className = '', html }) {
    return (_jsx(Element, { className: `vendora-rich-text ${className}`.trim(), dangerouslySetInnerHTML: { __html: sanitizeHtml(html) } }));
}
export function ContentPageTemplate({ children, description, html, title, }) {
    return (_jsxs("article", { className: "vendora-page vendora-content-page", children: [_jsx(PageHero, { description: description, title: title }), html ? _jsx(SafeHtml, { html: html }) : children] }));
}
export function ProductPageTemplate({ children, descriptionHtml, media, product, }) {
    const { formatMoney } = useStorefront();
    const { add } = useCart();
    const { isFavorite, toggle } = useFavorites();
    return (_jsxs("article", { className: "vendora-page vendora-product-page", children: [_jsx("div", { className: "vendora-product-page__media", children: media }), _jsxs("div", { className: "vendora-product-page__details", children: [_jsx(PageHero, { description: descriptionHtml ? _jsx(SafeHtml, { html: descriptionHtml }) : product.description, title: product.name }), _jsx("strong", { className: "vendora-product-page__price", children: formatMoney(product.price) }), _jsxs("div", { className: "vendora-product-page__actions", children: [_jsx(Button, { onClick: () => add(product), children: "Add to cart" }), _jsx(Button, { "aria-pressed": isFavorite(product.id), onClick: () => toggle(product.id), variant: "secondary", children: isFavorite(product.id) ? 'Remove favorite' : 'Add favorite' })] }), children] })] }));
}
//# sourceMappingURL=components.js.map