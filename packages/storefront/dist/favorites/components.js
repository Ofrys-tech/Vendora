import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ProductCard } from '../catalog/components';
import { useStorefront } from '../config/provider';
import { ButtonLink, EmptyState, PageHero } from '../layout/primitives';
import { useFavoriteProducts } from './use-favorite-products';
export function FavoritesPageTemplate({ description, detailPath, productMedia, title = 'Favorites', }) {
    const products = useFavoriteProducts();
    const { routes } = useStorefront();
    return (_jsxs("section", { className: "vendora-page vendora-favorites-page", children: [_jsx(PageHero, { description: description, title: title }), products.length ? (_jsx("div", { className: "vendora-product-grid", children: products.map((product) => (_jsx(ProductCard, { detailPath: detailPath, media: productMedia?.(product), product: product }, product.id))) })) : (_jsx(EmptyState, { action: _jsx(ButtonLink, { to: routes.catalog, children: "Browse catalog" }), title: "No favorites yet" }))] }));
}
//# sourceMappingURL=components.js.map