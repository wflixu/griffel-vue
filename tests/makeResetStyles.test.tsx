import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import { makeResetStyles } from './../src/makeResetStyles';

describe('makeResetStyles', () => {
  it('works outside of components', () => {
    expect(() => makeResetStyles({ root: { color: 'red' } })).not.toThrow();
  });

  it('throws inside components', () => {
    vi.spyOn(console, 'error').mockImplementation(() => { });

    // 使用 Vue 组件模拟组件内调用
    const TestComponent = {
      setup() {
        makeResetStyles({ color: 'red' });
        return () => null;
      },
    };

    expect(() => mount(TestComponent)).toThrow(/All makeResetStyles\(\) calls should be top level/);

    // 组件渲染后，外部调用不应抛错
    expect(() => makeResetStyles({ color: 'red' })).not.toThrow();
  });
});
