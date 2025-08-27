import { getCurrentInstance } from 'vue';

export function isInsideComponent() {
  // Vue3: 如果当前在组件 setup 或生命周期内，getCurrentInstance() 会返回实例
  return getCurrentInstance() !== null;
}

