import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router';
import { assertSafeUrl } from '../content/security.js';
export function Button({ className = '', variant = 'primary', type = 'button', ...props }) {
    return (_jsx("button", { className: `vendora-button vendora-button--${variant} ${className}`.trim(), type: type, ...props }));
}
export function ButtonLink({ className = '', variant = 'primary', ...props }) {
    const pathname = typeof props.to === 'string' ? props.to : props.to.pathname;
    if (pathname)
        assertSafeUrl(pathname);
    return (_jsx(Link, { className: `vendora-button vendora-button--${variant} ${className}`.trim(), ...props }));
}
export function EmptyState({ action, description, title }) {
    return (_jsxs("section", { className: "vendora-empty", role: "status", children: [_jsx("h2", { children: title }), description ? _jsx("p", { children: description }) : null, action] }));
}
export function PageHero({ actions, description, eyebrow, title }) {
    return (_jsxs("header", { className: "vendora-page-hero", children: [eyebrow ? _jsx("p", { className: "vendora-eyebrow", children: eyebrow }) : null, _jsx("h1", { children: title }), description ? _jsx("div", { className: "vendora-page-hero__description", children: description }) : null, actions ? _jsx("div", { className: "vendora-page-hero__actions", children: actions }) : null] }));
}
//# sourceMappingURL=primitives.js.map