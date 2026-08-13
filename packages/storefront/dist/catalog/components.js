import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router';
import { useCart, useFavorites, useStorefront } from '../config/provider.js';
import { assertSafeUrl } from '../content/security.js';
import { Button, EmptyState, PageHero } from '../layout/primitives.js';
export function ProductGallery({ media }) {
    if (!media.length)
        return null;
    return (_jsx("div", { className: "vendora-gallery", children: media.map((item) => (_jsx("img", { alt: item.alt, loading: "lazy", src: assertSafeUrl(item.src) }, item.src))) }));
}
export function ProductCard({ detailPath, media, product }) {
    const { formatMoney } = useStorefront();
    const { add } = useCart();
    const { isFavorite, toggle } = useFavorites();
    const productPath = detailPath?.(product);
    const title = productPath ? (_jsx(Link, { to: assertSafeUrl(productPath), children: product.name })) : (product.name);
    return (_jsxs("article", { className: "vendora-product-card", children: [media ? _jsx("div", { className: "vendora-product-card__media", children: media }) : null, _jsxs("div", { className: "vendora-product-card__body", children: [_jsx("h2", { children: title }), product.description ? _jsx("p", { children: product.description }) : null, _jsx("strong", { children: formatMoney(product.price) })] }), _jsxs("div", { className: "vendora-product-card__actions", children: [_jsx(Button, { onClick: () => add(product), children: "Add to cart" }), _jsx(Button, { "aria-pressed": isFavorite(product.id), onClick: () => toggle(product.id), variant: "ghost", children: isFavorite(product.id) ? 'Remove favorite' : 'Add favorite' })] })] }));
}
const sortLabels = {
    'name-asc': 'Name',
    'price-asc': 'Price: low to high',
    'price-desc': 'Price: high to low',
};
export function CatalogFilters({ catalog, categories }) {
    const config = useStorefront();
    const options = categories ?? config.catalog.categories;
    return (_jsxs("div", { className: "vendora-catalog-filters", children: [_jsxs("label", { children: ["Search", _jsx("input", { onChange: (event) => catalog.setQuery(event.currentTarget.value), type: "search", value: catalog.query })] }), _jsxs("label", { children: ["Category", _jsxs("select", { onChange: (event) => catalog.setCategoryId(event.currentTarget.value || null), value: catalog.categoryId ?? '', children: [_jsx("option", { value: "", children: "All categories" }), options.map((category) => (_jsx("option", { value: category.id, children: category.name }, category.id)))] })] }), _jsxs("label", { children: ["Sort", _jsx("select", { onChange: (event) => catalog.setSort(event.currentTarget.value), value: catalog.sort, children: Object.entries(sortLabels).map(([value, label]) => (_jsx("option", { value: value, children: label }, value))) })] })] }));
}
export function CatalogPageTemplate({ catalog, description, detailPath, empty, productMedia, title = 'Catalog', }) {
    const config = useStorefront();
    return (_jsxs("section", { className: "vendora-page vendora-catalog-page", children: [_jsx(PageHero, { description: description, title: title }), _jsx(CatalogFilters, { catalog: catalog }), catalog.products.length ? (_jsx("div", { className: "vendora-product-grid", children: catalog.products.map((product) => (_jsx(ProductCard, { detailPath: detailPath, media: productMedia?.(product), product: product }, product.id))) })) : ((empty ?? (_jsx(EmptyState, { description: "Try changing the active filters.", title: "No products found" })))), config.content?.afterCatalog] }));
}
//# sourceMappingURL=components.js.map