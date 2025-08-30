import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { GriffelRenderer } from '@griffel/core';

import { insertionFactory } from './../src/insertionFactory';

// 直接从 vi.mock 返回的模块获取 mock 实例
const useInsertionEffect = vi.mocked(
  (await import('./../src/useInsertionEffect')).useInsertionEffect
);

describe('canUseDOM', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses "useInsertionEffect" when available', () => {
    const renderer: Partial<GriffelRenderer> = { insertCSSRules: vi.fn() };
    const insertStyles = insertionFactory();

    insertStyles(renderer as GriffelRenderer, { d: ['a'] });

    expect(useInsertionEffect).toHaveBeenCalledTimes(1);
    expect(renderer.insertCSSRules).toHaveBeenCalledTimes(1);
  });
});

