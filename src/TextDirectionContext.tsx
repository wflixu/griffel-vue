import { provide, inject, defineComponent, type InjectionKey, computed, type Ref } from 'vue';

export type TextDirection = 'ltr' | 'rtl'

export interface TextDirectionProviderProps {
  /** Indicates the directionality of the element's text. */
  dir: TextDirection;
}

export const TextDirectionContextKey: InjectionKey<Ref<TextDirection>> = Symbol('TextDirection');

/**
 * @public
 */
export const TextDirectionProvider = defineComponent<TextDirectionProviderProps>({
  name: 'TextDirectionProvider',
  props: {
    dir: {
      type: String as () => TextDirection,
      default: 'ltr' as TextDirection,
      required: false
    }
  },
  setup(props, { slots }) {
    const dir = computed(() => props.dir);
    provide(TextDirectionContextKey, dir);
    return () => slots.default?.();
  },
});

/**
 * Returns current directionality of the element's text.
 *
 * @private
 */
export function useTextDirection(): TextDirection {
  return inject<TextDirection>(TextDirectionContextKey, 'ltr');
}
