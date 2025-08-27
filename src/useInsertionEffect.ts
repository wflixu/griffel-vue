import { onBeforeMount } from 'vue';

// Vue3 版本的 useInsertionEffect，模拟 React 的 useInsertionEffect 行为
export function useInsertionEffect(effect: () => void) {
  onBeforeMount(effect);
}
