export type Money = Readonly<{
    amountMinor: number;
    currency: string;
}>;
export declare function money(amountMinor: number, currency: string): Money;
export declare function addMoney(left: Money, right: Money): Money;
export declare function multiplyMoney(value: Money, quantity: number): Money;
export declare function assertSameCurrency(left: Money, right: Money): void;
//# sourceMappingURL=money.d.ts.map