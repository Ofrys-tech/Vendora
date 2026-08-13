export function money(amountMinor, currency) {
    if (!Number.isSafeInteger(amountMinor)) {
        throw new TypeError('Money amount must be a safe integer in minor units.');
    }
    const normalizedCurrency = currency.trim().toUpperCase();
    if (!/^[A-Z]{3}$/u.test(normalizedCurrency)) {
        throw new TypeError('Money currency must be a three-letter ISO code.');
    }
    return { amountMinor, currency: normalizedCurrency };
}
export function addMoney(left, right) {
    assertSameCurrency(left, right);
    return money(left.amountMinor + right.amountMinor, left.currency);
}
export function multiplyMoney(value, quantity) {
    if (!Number.isSafeInteger(quantity) || quantity < 0) {
        throw new RangeError('Money quantity must be a non-negative safe integer.');
    }
    return money(value.amountMinor * quantity, value.currency);
}
export function assertSameCurrency(left, right) {
    if (left.currency !== right.currency) {
        throw new TypeError(`Currency mismatch: ${left.currency} and ${right.currency}.`);
    }
}
//# sourceMappingURL=money.js.map