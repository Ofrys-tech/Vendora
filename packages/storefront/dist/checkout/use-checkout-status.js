import { shouldPollCheckout } from '@vendora/core';
import { useEffect, useState } from 'react';
import { useStorefront } from '../config/provider.js';
export function useCheckoutStatus(checkoutId, options = {}) {
    const { checkoutClient } = useStorefront();
    const [checkout, setCheckout] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(Boolean(checkoutId));
    const pollIntervalMs = options.pollIntervalMs ?? 2500;
    async function refresh() {
        if (!checkoutId)
            return;
        setLoading(true);
        try {
            setCheckout(await checkoutClient.getCheckoutStatus(checkoutId));
            setError(null);
        }
        catch (cause) {
            setError(cause instanceof Error ? cause : new Error('Unable to load checkout status.'));
        }
        finally {
            setLoading(false);
        }
    }
    useEffect(() => {
        let active = true;
        let timer;
        if (!checkoutId) {
            setCheckout(null);
            setLoading(false);
            return () => undefined;
        }
        const poll = async () => {
            setLoading(true);
            try {
                const next = await checkoutClient.getCheckoutStatus(checkoutId);
                if (!active)
                    return;
                setCheckout(next);
                setError(null);
                if (shouldPollCheckout(next))
                    timer = setTimeout(poll, pollIntervalMs);
            }
            catch (cause) {
                if (!active)
                    return;
                setError(cause instanceof Error ? cause : new Error('Unable to load checkout status.'));
            }
            finally {
                if (active)
                    setLoading(false);
            }
        };
        void poll();
        return () => {
            active = false;
            if (timer)
                clearTimeout(timer);
        };
    }, [checkoutClient, checkoutId, pollIntervalMs]);
    return { checkout, error, loading, refresh };
}
//# sourceMappingURL=use-checkout-status.js.map