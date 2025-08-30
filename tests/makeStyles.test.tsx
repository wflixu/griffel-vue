import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import { makeStyles } from '../src/makeStyles';

describe('makeStyles', () => {
  it('works outside of components', () => {
    expect(() => makeStyles({ root: { color: 'red' } })).not.toThrow();
  });

  it('throws inside components', () => {
    vi.spyOn(console, 'error').mockImplementation(() => { });

    // 使用 Vue 组件模拟组件内调用
    const TestComponent = {
      setup() {
        makeStyles({ root: { color: 'red' } });
        return () => null;
      },
    };

    expect(() => mount(TestComponent)).toThrow(/All makeStyles\(\) calls should be top level/);

    // 组件渲染后，外部调用不应抛错
    expect(() => makeStyles({ root: { color: 'red' } })).not.toThrow();
  });
});


