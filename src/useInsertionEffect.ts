import { onBeforeUpdate, onMounted, onUnmounted } from 'vue';


// Vue3 版本的 useInsertionEffect，模拟 React 的 useInsertionEffect 行为
export const useInsertionEffect = (effect: () => void | (() => void), deps?: any[]) => {
  let cleanup: (() => void) | undefined

  onBeforeUpdate(() => {
    // 执行清理（如果存在）
    if (cleanup) {
      cleanup()
      cleanup = undefined
    }

    // 执行 effect 并获取清理函数
    const result = effect()
    if (typeof result === 'function') {
      cleanup = result
    }
  })

  // 组件卸载时清理
  onUnmounted(() => {
    if (cleanup) {
      cleanup()
    }
  })

  // 初始执行
  onMounted(() => {
    const result = effect()
    if (typeof result === 'function') {
      cleanup = result
    }
  })
}
