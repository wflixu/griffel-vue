import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { useInsertionEffect } from '../src/useInsertionEffect'

describe('useInsertionEffect', () => {
    let cleanupSpy: ReturnType<typeof vi.fn>
    let effectSpy: ReturnType<typeof vi.fn>

    beforeEach(() => {
        cleanupSpy = vi.fn()
        effectSpy = vi.fn().mockReturnValue(cleanupSpy)
    })

    afterEach(() => {
        vi.clearAllMocks()
    })

    it('应该在组件挂载时执行effect', async () => {
        const TestComponent = defineComponent({
            setup() {
                useInsertionEffect(effectSpy)
                return {}
            },
            template: '<div>Test</div>'
        })

        mount(TestComponent)

        expect(effectSpy).toHaveBeenCalledTimes(1)
    })

    it('应该在组件更新前执行effect和清理函数', async () => {
        const TestComponent = defineComponent({
            setup() {
                const count = ref(0)
                useInsertionEffect(effectSpy)

                return {
                    count
                }
            },
            template: '<div @click="count++">{{ count }}</div>'
        })

        const wrapper = mount(TestComponent)

        // 初始挂载
        expect(effectSpy).toHaveBeenCalledTimes(1)
        expect(cleanupSpy).not.toHaveBeenCalled()

        // 触发更新
        await wrapper.trigger('click')

        // 更新前应该先调用清理函数，再调用effect
        expect(cleanupSpy).toHaveBeenCalledTimes(1)
        expect(effectSpy).toHaveBeenCalledTimes(2)
    })

    it('应该在组件卸载时执行清理函数', async () => {
        const TestComponent = defineComponent({
            setup() {
                useInsertionEffect(effectSpy)
                return {}
            },
            template: '<div>Test</div>'
        })

        const wrapper = mount(TestComponent)

        // 初始挂载
        expect(effectSpy).toHaveBeenCalledTimes(1)
        expect(cleanupSpy).not.toHaveBeenCalled()

        // 卸载组件
        wrapper.unmount()

        // 卸载时应该调用清理函数
        expect(cleanupSpy).toHaveBeenCalledTimes(1)
    })

    it('应该正确处理没有返回清理函数的effect', async () => {
        const effectWithoutCleanup = vi.fn()

        const TestComponent = defineComponent({
            setup() {
                useInsertionEffect(effectWithoutCleanup)
                return {}
            },
            template: '<div>Test</div>'
        })

        const wrapper = mount(TestComponent)

        // 初始挂载
        expect(effectWithoutCleanup).toHaveBeenCalledTimes(1)

        // 强制更新组件
        await wrapper.vm.$forceUpdate()

        // 更新时应该再次调用effect，但没有清理函数可调用
        expect(effectWithoutCleanup).toHaveBeenCalledTimes(2)

        // 卸载组件（应该不会抛出错误）
        wrapper.unmount()
    })

    it('应该正确处理依赖数组变化', async () => {
        const count = ref(0)
        const effectWithDeps = vi.fn().mockReturnValue(cleanupSpy)

        const TestComponent = defineComponent({
            setup() {
                useInsertionEffect(effectWithDeps, [count.value])
                return {
                    count
                }
            },
            template: '<div @click="count++">{{ count }}</div>'
        })

        const wrapper = mount(TestComponent)

        // 初始挂载
        expect(effectWithDeps).toHaveBeenCalledTimes(1)

        // 更新count，触发依赖变化
        await wrapper.trigger('click')

        // 依赖变化时应该先调用清理函数，再调用effect
        expect(cleanupSpy).toHaveBeenCalledTimes(1)
        expect(effectWithDeps).toHaveBeenCalledTimes(2)
    })
})