import { getCurrentInstance } from 'vue';

export function isInsideComponent() {
    // Vue3: 如果当前在组件 setup 或生命周期内，getCurrentInstance() 会返回实例
    return getCurrentInstance() !== null;
}

/**
 * Verifies if an application can use DOM.
 */
export function canUseDOM(): boolean {
    return typeof window !== 'undefined' && !!(window.document && window.document.createElement);
}
