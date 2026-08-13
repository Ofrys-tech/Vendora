import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router';
import { assertSafeUrl } from '../content/security.js';

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  Readonly<{ variant?: 'primary' | 'secondary' | 'ghost' }>;

export function Button({
  className = '',
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`vendora-button vendora-button--${variant} ${className}`.trim()}
      type={type}
      {...props}
    />
  );
}

export type ButtonLinkProps = LinkProps & Readonly<{ variant?: ButtonProps['variant'] }>;

export function ButtonLink({ className = '', variant = 'primary', ...props }: ButtonLinkProps) {
  const pathname = typeof props.to === 'string' ? props.to : props.to.pathname;
  if (pathname) assertSafeUrl(pathname);
  return (
    <Link className={`vendora-button vendora-button--${variant} ${className}`.trim()} {...props} />
  );
}

export type EmptyStateProps = Readonly<{
  action?: ReactNode;
  description?: ReactNode;
  title: ReactNode;
}>;

export function EmptyState({ action, description, title }: EmptyStateProps) {
  return (
    <section className="vendora-empty" role="status">
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
      {action}
    </section>
  );
}

export type PageHeroProps = Readonly<{
  actions?: ReactNode;
  description?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
}>;

export function PageHero({ actions, description, eyebrow, title }: PageHeroProps) {
  return (
    <header className="vendora-page-hero">
      {eyebrow ? <p className="vendora-eyebrow">{eyebrow}</p> : null}
      <h1>{title}</h1>
      {description ? <div className="vendora-page-hero__description">{description}</div> : null}
      {actions ? <div className="vendora-page-hero__actions">{actions}</div> : null}
    </header>
  );
}
