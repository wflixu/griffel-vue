import { styleBucketOrdering } from '@griffel/core';
import type { GriffelRenderer } from '@griffel/core';
import { h } from 'vue';

/**
 * 返回一组 <style> VNode，适用于 Vue3 SSR。
 */
export function renderToStyleElements(renderer: GriffelRenderer) {
  const stylesheets = Object.values(renderer.stylesheets)
    // first sort: bucket names
    .sort((a, b) => {
      return styleBucketOrdering.indexOf(a.bucketName) - styleBucketOrdering.indexOf(b.bucketName);
    })
    // second sort: media queries
    .sort((a, b) => {
      const mediaA = a.elementAttributes['media'];
      const mediaB = b.elementAttributes['media'];

      if (mediaA && mediaB) {
        return renderer.compareMediaQueries(mediaA, mediaB);
      }

      if (mediaA || mediaB) {
        return mediaA ? 1 : -1;
      }

      return 0;
    });

  return stylesheets
    .map(stylesheet => {
      const cssRules = stylesheet.cssRules();
      // don't want to create any empty style elements
      if (!cssRules.length) {
        return null;
      }

      return h(
        'style',
        {
          key: stylesheet.bucketName,

          // TODO: support "nonce"
          // ...renderer.styleNodeAttributes,
          ...stylesheet.elementAttributes,
          'data-make-styles-rehydration': 'true',
          innerHTML: cssRules.join(''),
        }
      );
    })
    .filter(Boolean);
}
