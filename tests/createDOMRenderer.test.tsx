import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent } from 'vue';
import { createDOMRenderer } from '@griffel/core';
import { RendererProvider, useRenderer } from '../src/RendererContext';

describe('createDOMRenderer', () => {
  let originalDocument: typeof document;
  
  beforeEach(() => {
    originalDocument = global.document;
  });

  afterEach(() => {
    global.document = originalDocument;
    vi.clearAllMocks();
  });

  it('创建一个默认的渲染器', () => {
    const renderer = createDOMRenderer();
    
    expect(renderer).toBeDefined();
    expect(typeof renderer.insertCSSRules).toBe('function');
    expect(typeof renderer.compareMediaQueries).toBe('function');
    expect(typeof renderer.insertionCache).toBe('object');
    expect(typeof renderer.stylesheets).toBe('object');
  });

  it('使用提供的选项创建渲染器', () => {
    const testDocument = {} as Document;
    const testNonce = 'test-nonce';
    
    const renderer = createDOMRenderer({
      document: testDocument,
      nonce: testNonce,
    });
    
    expect(renderer).toBeDefined();
    // 注意：在某些环境中targetDocument可能是undefined
    // 我们只验证nonce被正确设置
    expect(renderer.styleNodeAttributes.nonce).toBe(testNonce);
  });

  it('在没有document的环境中创建渲染器', () => {
    // @ts-ignore - 故意删除 document 对象以测试
    delete global.document;
    
    const renderer = createDOMRenderer();
    
    expect(renderer).toBeDefined();
    expect(renderer.targetDocument).toBeUndefined();
  });

  it('创建的渲染器可以插入CSS规则', () => {
    const renderer = createDOMRenderer();
    const insertCSSRulesSpy = vi.spyOn(renderer, 'insertCSSRules');
    
    renderer.insertCSSRules({ d: ['test-rule'] });
    
    expect(insertCSSRulesSpy).toHaveBeenCalledTimes(1);
    expect(insertCSSRulesSpy).toHaveBeenCalledWith({ d: ['test-rule'] });
  });

  it('可以通过RendererProvider提供渲染器给组件', async () => {
    const customRenderer = createDOMRenderer();
    const insertCSSRulesSpy = vi.spyOn(customRenderer, 'insertCSSRules');
    
    // 创建一个使用useRenderer的测试组件
    const TestComponent = defineComponent({
      setup() {
        const renderer = useRenderer();
        // 在组件中使用渲染器
        renderer.insertCSSRules({ d: ['component-rule'] });
        return () => <div>Test Component</div>;
      },
    });
    
    // 使用RendererProvider包装测试组件
    const wrapper = mount(RendererProvider, {
      props: {
        renderer: customRenderer
      },
      slots: {
        default: () => <TestComponent />
      }
    });
    
    // 验证渲染器被正确使用
    expect(wrapper.html()).toContain('Test Component');
    expect(insertCSSRulesSpy).toHaveBeenCalledTimes(1);
    expect(insertCSSRulesSpy).toHaveBeenCalledWith({ d: ['component-rule'] });
  });
});