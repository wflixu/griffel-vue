import { createDOMRenderer, rehydrateRendererCache } from '@griffel/core';
import type { GriffelRenderer } from '@griffel/core';
import { provide, inject, defineComponent, h } from 'vue';

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
    if (canUseDOM()) {
      rehydrateRendererCache(props.renderer, props.targetDocument);
    }
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
