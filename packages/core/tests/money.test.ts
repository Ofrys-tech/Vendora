import { addMoney, money, multiplyMoney } from '../src/index';
import { describe, expect, it } from 'vitest';

describe('money', () => {
  it('normalizes currencies and performs integer arithmetic', () => {
    expect(addMoney(money(100, 'usd'), multiplyMoney(money(250, 'USD'), 2))).toEqual(
      money(600, 'USD'),
    );
  });

  it.each([
    () => money(1.5, 'USD'),
    () => money(1, 'US'),
    () => multiplyMoney(money(1, 'USD'), -1),
    () => addMoney(money(1, 'USD'), money(1, 'EUR')),
  ])('rejects invalid monetary input', (operation) => {
    expect(operation).toThrow();
  });
});
