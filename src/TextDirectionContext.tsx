import { provide, inject, defineComponent, h } from 'vue';

export interface TextDirectionProviderProps {
  /** Indicates the directionality of the element's text. */
  dir: 'ltr' | 'rtl';
}

/**
 * @private
 */
const TextDirectionContextKey = Symbol('TextDirectionContext');

/**
 * @public
 */
export const TextDirectionProvider = defineComponent<TextDirectionProviderProps>({
  name: 'TextDirectionProvider',
  props: {
    dir: { type: String as () => 'ltr' | 'rtl', required: true },
  },
  setup(props, { slots }) {
    provide(TextDirectionContextKey, props.dir);
    return () => h('div', {}, slots.default ? slots.default() : []);
  },
});

/**
 * Returns current directionality of the element's text.
 *
 * @private
 */
export function useTextDirection(): 'ltr' | 'rtl' {
  return inject<'ltr' | 'rtl'>(TextDirectionContextKey, 'ltr');
}
