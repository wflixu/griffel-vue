import { createDOMRenderer, rehydrateRendererCache } from '@griffel/core';
import type { GriffelRenderer } from '@griffel/core';
import { provide, inject, defineComponent, h, watch, onMounted } from 'vue';

import { canUseDOM } from './utils/canUseDOM';

export interface RendererProviderProps {
  /** An instance of Griffel renderer. */
  renderer: GriffelRenderer;

  /**
   * Document used to insert CSS variables to head
   */
  targetDocument?: Document;
}

/**
 * Vue3 版本的 RendererProvider
 */
export const RendererProvider = defineComponent<RendererProviderProps>({
  name: 'RendererProvider',
  props: {
    renderer: { type: Object as () => GriffelRenderer, required: true },
    targetDocument: { type: Object as () => Document, required: false },
  },
  setup(props, { slots }) {
    // 在 DOM 可用时，并且 renderer/targetDocument 变化时执行 rehydrateRendererCache
    const doRehydrate = () => {
      if (canUseDOM()) {
        rehydrateRendererCache(props.renderer, props.targetDocument);
      }
    };

    onMounted(doRehydrate);
    watch(
      () => [props.renderer, props.targetDocument],
      doRehydrate,
      { immediate: true }
    );

    provide('RendererContextKey', props.renderer);
    return () => h('div', {}, slots.default ? slots.default() : []);
  },
});

/**
 * Vue3 版本的 useRenderer
 */
export function useRenderer(): GriffelRenderer {
  const renderer = inject<GriffelRenderer>('RendererContextKey', createDOMRenderer());
  return renderer;
}
