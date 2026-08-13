import { describe, expect, it } from 'vitest';
import { describeDemoStore } from '../src/index';

describe('demo store package boundary', () => {
  it('consumes checkout rules through the public core package', () => {
    expect(describeDemoStore()).toEqual({
      name: 'Vendora Demo Store',
      polling: true,
      status: 'awaiting_payment',
    });
  });
});
