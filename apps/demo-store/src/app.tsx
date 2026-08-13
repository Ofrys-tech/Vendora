import {
  CartDrawer,
  CartPageTemplate,
  CatalogPageTemplate,
  CheckoutPageTemplate,
  CheckoutStatus,
  DeliveryList,
  FavoritesPageTemplate,
  PageHero,
  StorefrontProvider,
  StorefrontShell,
  useCatalog,
  useCheckoutStatus,
} from '@vendora/storefront';
import { useEffect } from 'react';
import {
  Link,
  Navigate,
  Route,
  Routes,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router';
import { demoConfig } from './config';
import { completeDemoPayment, type DemoScenario } from './fake-checkout';

function DocumentTitle({ value }: Readonly<{ value: string }>) {
  useEffect(() => {
    document.title = `${value} | Northstar Digital`;
  }, [value]);
  return null;
}

function HomePage() {
  return (
    <section className="demo-home">
      <DocumentTitle value="Demo store" />
      <p className="vendora-eyebrow">Vendora reference app</p>
      <h1>Small files. Clear contracts. Replaceable infrastructure.</h1>
      <p>
        Browse a neutral catalog, choose a deterministic payment outcome, and inspect delivery
        states.
      </p>
      <Link className="vendora-button vendora-button--primary" to="/catalog">
        Explore the catalog
      </Link>
    </section>
  );
}

function CatalogPage() {
  const catalog = useCatalog();
  return (
    <>
      <DocumentTitle value="Catalog" />
      <CatalogPageTemplate
        catalog={catalog}
        description="Neutral files and fixtures for exploring Vendora."
        title="Digital goods, without provider lock-in"
      />
    </>
  );
}

function PaymentPage() {
  const { checkoutId = '' } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scenario = (searchParams.get('scenario') ?? 'success') as DemoScenario;

  function completePayment() {
    completeDemoPayment(checkoutId, scenario);
    navigate(`/status/${checkoutId}`);
  }

  return (
    <section className="vendora-page demo-payment">
      <DocumentTitle value="Test payment" />
      <PageHero
        description={`Scenario: ${scenario}`}
        eyebrow="Local payment simulator"
        title="Confirm the test outcome"
      />
      <button
        className="vendora-button vendora-button--primary"
        onClick={completePayment}
        type="button"
      >
        Complete test payment
      </button>
    </section>
  );
}

function StatusPage() {
  const { checkoutId = '' } = useParams();
  const { checkout, error, loading } = useCheckoutStatus(checkoutId, {
    pollIntervalMs: 250,
  });

  return (
    <section className="vendora-page">
      <DocumentTitle value="Order status" />
      <PageHero
        description="This page reads the fake gateway through CheckoutClient."
        title="Order status"
      />
      {loading && !checkout ? <p role="status">Loading checkout...</p> : null}
      {error ? <p role="alert">{error.message}</p> : null}
      {checkout ? (
        <>
          <CheckoutStatus checkout={checkout} />
          <DeliveryList items={checkout.deliveryItems} />
          {checkout.status === 'manual_review' ? (
            <p className="demo-manual">A store operator would continue fulfillment here.</p>
          ) : null}
        </>
      ) : null}
    </section>
  );
}

function AboutPage() {
  return (
    <section className="vendora-page">
      <DocumentTitle value="How it works" />
      <PageHero
        description="Catalog data, theme, routes, gateway, and delivery fixtures live in this application."
        title="Built only from public Vendora APIs"
      />
    </section>
  );
}

export function DemoApp() {
  return (
    <StorefrontProvider config={demoConfig}>
      <StorefrontShell>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<AboutPage />} path="/about" />
          <Route element={<CatalogPage />} path="/catalog" />
          <Route
            element={
              <>
                <DocumentTitle value="Cart" />
                <CartPageTemplate />
              </>
            }
            path="/cart"
          />
          <Route
            element={
              <>
                <DocumentTitle value="Favorites" />
                <FavoritesPageTemplate />
              </>
            }
            path="/favorites"
          />
          <Route
            element={
              <>
                <DocumentTitle value="Checkout" />
                <CheckoutPageTemplate />
              </>
            }
            path="/checkout"
          />
          <Route element={<PaymentPage />} path="/payment/:checkoutId" />
          <Route element={<StatusPage />} path="/status/:checkoutId" />
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
        <CartDrawer />
      </StorefrontShell>
    </StorefrontProvider>
  );
}
