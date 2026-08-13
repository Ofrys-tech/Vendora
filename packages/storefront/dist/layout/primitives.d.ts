import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { type LinkProps } from 'react-router';
export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & Readonly<{
    variant?: 'primary' | 'secondary' | 'ghost';
}>;
export declare function Button({ className, variant, type, ...props }: ButtonProps): import("react").JSX.Element;
export type ButtonLinkProps = LinkProps & Readonly<{
    variant?: ButtonProps['variant'];
}>;
export declare function ButtonLink({ className, variant, ...props }: ButtonLinkProps): import("react").JSX.Element;
export type EmptyStateProps = Readonly<{
    action?: ReactNode;
    description?: ReactNode;
    title: ReactNode;
}>;
export declare function EmptyState({ action, description, title }: EmptyStateProps): import("react").JSX.Element;
export type PageHeroProps = Readonly<{
    actions?: ReactNode;
    description?: ReactNode;
    eyebrow?: ReactNode;
    title: ReactNode;
}>;
export declare function PageHero({ actions, description, eyebrow, title }: PageHeroProps): import("react").JSX.Element;
//# sourceMappingURL=primitives.d.ts.map