import type { CSSRulesByBucket, GriffelInsertionFactory, GriffelRenderer } from '@griffel/core';

import { canUseDOM } from './utils/canUseDOM';
import { useInsertionEffect } from './useInsertionEffect';

export const insertionFactory: GriffelInsertionFactory = () => {
  const insertionCache: Record<string, boolean> = {};

  return function insert(renderer: GriffelRenderer, cssRules: CSSRulesByBucket) {
    // Even if `useInsertionEffect` is available, we can use it on a client only as it will not be executed in SSR
    if (useInsertionEffect && canUseDOM()) {
      useInsertionEffect(() => {
        renderer.insertCSSRules(cssRules!);
      });

      return;
    }

    if (insertionCache[renderer.id] === undefined) {
      renderer.insertCSSRules(cssRules!);
      insertionCache[renderer.id] = true;
    }
  };
};
