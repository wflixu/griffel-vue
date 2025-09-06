import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { isInsideComponent, canUseDOM } from '../src/utils' // 请根据实际路径调整

describe('utils', () => {
    describe('isInsideComponent', () => {
        it('在组件内部调用时应返回 true', () => {
            const TestComponent = defineComponent({
                setup() {
                    const result = isInsideComponent()
                    return { result }
                },
                template: '<div>{{ result }}</div>'
            })

            const wrapper = mount(TestComponent)

            expect(wrapper.vm.result).toBe(true)
        })

        it('在组件外部调用时应返回 false', () => {
            // 直接在测试环境中调用，不在组件内部
            const result = isInsideComponent()

            expect(result).toBe(false)
        })
    })

    describe('canUseDOM', () => {
        let originalWindow: typeof globalThis.window
        let originalDocument: typeof globalThis.document

        beforeEach(() => {
            // 保存原始全局对象
            originalWindow = global.window
            originalDocument = global.document
        })

        afterEach(() => {
            // 恢复原始全局对象
            global.window = originalWindow
            global.document = originalDocument
        })

        it('在浏览器环境中应返回 true', () => {
            // 默认情况下，Vitest 运行在类似浏览器的环境中
            expect(canUseDOM()).toBe(true)
        })

        it('在没有 window 对象的环境中应返回 false', () => {
            // 模拟没有 window 对象的环境（如 Node.js）
            // @ts-ignore - 故意删除 window 对象以测试
            delete global.window

            expect(canUseDOM()).toBe(false)
        })

        it('在没有 document 对象的环境中应返回 false', () => {
            // 模拟没有 document 对象的环境
            const originalDocument = global.document
            // @ts-ignore - 故意删除 document 对象以测试
            delete global.document

            expect(canUseDOM()).toBe(false)

            // 恢复 document 对象
            global.document = originalDocument
        })

        it('在没有 document.createElement 的环境中应返回 false', () => {
            // 模拟没有 createElement 方法的 document 对象
            const originalDocument = global.document
            // @ts-ignore - 故意修改 document 对象以测试
            global.document = { ...originalDocument }
            // @ts-ignore - 故意删除 createElement 方法以测试
            delete global.document.createElement

            expect(canUseDOM()).toBe(false)

            // 恢复 document 对象
            global.document = originalDocument
        })
    })
})