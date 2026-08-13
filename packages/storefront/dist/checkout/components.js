import { jsxs as _jsxs, jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { useCart, useStorefront } from '../config/provider';
import { assertSafeUrl } from '../content/security';
import { Button, ButtonLink, EmptyState, PageHero } from '../layout/primitives';
const checkoutStatusLabels = {
    awaiting_payment: 'Awaiting payment',
    cancelled: 'Cancelled',
    draft: 'Draft',
    expired: 'Expired',
    failed: 'Failed',
    fulfilled: 'Delivered',
    fulfilling: 'Preparing delivery',
    manual_review: 'Manual review',
    payment_confirmed: 'Payment confirmed',
};
export function CheckoutStatus({ checkout }) {
    return (_jsxs("section", { "aria-live": "polite", className: "vendora-checkout-status", "data-status": checkout.status, children: [_jsxs("p", { className: "vendora-eyebrow", children: ["Checkout ", checkout.id] }), _jsx("h2", { children: checkoutStatusLabels[checkout.status] }), _jsxs("p", { children: ["Payment: ", checkout.paymentStatus.replaceAll('_', ' ')] }), _jsxs("p", { children: ["Delivery: ", checkout.fulfillmentStatus.replaceAll('_', ' ')] })] }));
}
export function DeliveryList({ items }) {
    if (!items.length)
        return null;
    return (_jsxs("section", { className: "vendora-delivery", children: [_jsx("h2", { children: "Delivery" }), _jsx("div", { className: "vendora-delivery__items", children: items.map((item) => (_jsxs("article", { children: [_jsx("h3", { children: item.title }), item.secret ? _jsx("code", { children: item.secret }) : null, item.instructions ? _jsx("p", { children: item.instructions }) : null] }, item.id))) })] }));
}
export function CheckoutPageTemplate({ description, onStarted, title = 'Checkout', }) {
    const { cart } = useCart();
    const config = useStorefront();
    const [customerEmail, setCustomerEmail] = useState('');
    const [paymentMethodId, setPaymentMethodId] = useState(config.paymentMethods[0]?.id ?? '');
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    async function submit(event) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);
        try {
            const next = await config.checkoutClient.startCheckout({
                cart,
                customerEmail,
                paymentMethodId,
            });
            if (next.paymentUrl)
                assertSafeUrl(next.paymentUrl);
            setResult(next);
            onStarted?.(next);
        }
        catch (cause) {
            setError(cause instanceof Error ? cause : new Error('Unable to start checkout.'));
        }
        finally {
            setSubmitting(false);
        }
    }
    if (!cart.lines.length) {
        return (_jsxs("section", { className: "vendora-page vendora-checkout-page", children: [_jsx(PageHero, { description: description, title: title }), _jsx(EmptyState, { action: _jsx(ButtonLink, { to: config.routes.catalog, children: "Browse catalog" }), title: "Add a product before checkout" })] }));
    }
    return (_jsxs("section", { className: "vendora-page vendora-checkout-page", children: [_jsx(PageHero, { description: description, title: title }), result ? (_jsxs(_Fragment, { children: [_jsx(CheckoutStatus, { checkout: result.checkout }), result.paymentUrl ? (_jsx("a", { className: "vendora-button vendora-button--primary", href: assertSafeUrl(result.paymentUrl), children: "Continue to payment" })) : null, _jsx(DeliveryList, { items: result.checkout.deliveryItems })] })) : (_jsxs("form", { className: "vendora-checkout-form", onSubmit: submit, children: [_jsxs("label", { children: ["Email", _jsx("input", { autoComplete: "email", onChange: (event) => setCustomerEmail(event.currentTarget.value), required: true, type: "email", value: customerEmail })] }), _jsxs("fieldset", { children: [_jsx("legend", { children: "Payment method" }), config.paymentMethods.map((method) => (_jsxs("label", { children: [_jsx("input", { checked: paymentMethodId === method.id, name: "paymentMethod", onChange: () => setPaymentMethodId(method.id), required: true, type: "radio", value: method.id }), _jsxs("span", { children: [_jsx("strong", { children: method.label }), method.description ? _jsx("small", { children: method.description }) : null] })] }, method.id)))] }), error ? _jsx("p", { role: "alert", children: error.message }) : null, _jsx(Button, { disabled: submitting || !paymentMethodId, type: "submit", children: submitting ? 'Starting checkout...' : 'Continue' })] }))] }));
}
export function CheckoutStatusPageTemplate({ checkout, description, title = 'Order status', }) {
    return (_jsxs("section", { className: "vendora-page vendora-checkout-page", children: [_jsx(PageHero, { description: description, title: title }), _jsx(CheckoutStatus, { checkout: checkout }), _jsx(DeliveryList, { items: checkout.deliveryItems })] }));
}
//# sourceMappingURL=components.js.map