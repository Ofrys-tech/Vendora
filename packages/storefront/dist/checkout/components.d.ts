import type { CheckoutState, DeliveryItem, StartCheckoutResult } from '@vendora/core';
import { type ReactNode } from 'react';
export declare function CheckoutStatus({ checkout }: Readonly<{
    checkout: CheckoutState;
}>): import("react").JSX.Element;
export declare function DeliveryList({ items }: Readonly<{
    items: readonly DeliveryItem[];
}>): import("react").JSX.Element | null;
export type CheckoutPageTemplateProps = Readonly<{
    description?: ReactNode;
    onStarted?: (result: StartCheckoutResult) => void;
    title?: ReactNode;
}>;
export declare function CheckoutPageTemplate({ description, onStarted, title, }: CheckoutPageTemplateProps): import("react").JSX.Element;
export type CheckoutStatusPageTemplateProps = Readonly<{
    checkout: CheckoutState;
    description?: ReactNode;
    title?: ReactNode;
}>;
export declare function CheckoutStatusPageTemplate({ checkout, description, title, }: CheckoutStatusPageTemplateProps): import("react").JSX.Element;
//# sourceMappingURL=components.d.ts.map