export function searchProducts(products, query) {
    const normalized = query.trim().toLocaleLowerCase();
    if (!normalized)
        return [...products];
    return products.filter((product) => [product.name, product.slug, product.description ?? '', ...(product.tags ?? [])]
        .join(' ')
        .toLocaleLowerCase()
        .includes(normalized));
}
export function sortProducts(products, sort) {
    return [...products].sort((left, right) => {
        if (sort === 'price-asc' || sort === 'price-desc') {
            if (left.price.currency !== right.price.currency) {
                throw new TypeError('Products must use the same currency to be sorted by price.');
            }
            const difference = left.price.amountMinor - right.price.amountMinor;
            return sort === 'price-asc' ? difference : -difference;
        }
        return left.name.localeCompare(right.name);
    });
}
export function categoryDescendantIds(categories, categoryId) {
    const result = new Set([categoryId]);
    const pending = [categoryId];
    while (pending.length) {
        const parentId = pending.shift();
        for (const category of categories) {
            if (category.parentId === parentId && !result.has(category.id)) {
                result.add(category.id);
                pending.push(category.id);
            }
        }
    }
    return result;
}
export function productsInCategory(products, categories, categoryId) {
    const categoryIds = categoryDescendantIds(categories, categoryId);
    return products.filter((product) => categoryIds.has(product.categoryId));
}
export function buildCategoryTree(categories) {
    const byParent = new Map();
    const ids = new Set(categories.map((category) => category.id));
    for (const category of categories) {
        if (category.parentId !== null && !ids.has(category.parentId)) {
            throw new TypeError(`Unknown parent category: ${category.parentId}.`);
        }
        const siblings = byParent.get(category.parentId) ?? [];
        siblings.push(category);
        byParent.set(category.parentId, siblings);
    }
    const visiting = new Set();
    const visit = (category) => {
        if (visiting.has(category.id))
            throw new TypeError(`Category cycle detected at ${category.id}.`);
        visiting.add(category.id);
        const node = {
            ...category,
            children: (byParent.get(category.id) ?? []).map(visit),
        };
        visiting.delete(category.id);
        return node;
    };
    const roots = (byParent.get(null) ?? []).map(visit);
    const included = new Set();
    const collect = (nodes) => {
        for (const node of nodes) {
            included.add(node.id);
            collect(node.children);
        }
    };
    collect(roots);
    if (included.size !== categories.length)
        throw new TypeError('Category tree contains a cycle.');
    return roots;
}
//# sourceMappingURL=index.js.map