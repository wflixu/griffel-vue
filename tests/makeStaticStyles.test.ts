import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { makeStaticStyles } from '../src/makeStaticStyles'
import type { GriffelStaticStyles } from '@griffel/core'

// 使用 vi.hoisted 来定义需要在 mock 中使用的变量
const mocks = vi.hoisted(() => {
    return {
        mockVanillaMakeStaticStyles: vi.fn().mockReturnValue(vi.fn()),
        mockUseRenderer: vi.fn(),
        mockRenderer: {
            id: 'test-renderer',
            insertCSSRules: vi.fn()
        }
    }
})

// 模拟依赖模块
vi.mock('@griffel/core', () => ({
    makeStaticStyles: mocks.mockVanillaMakeStaticStyles
}))

vi.mock('../src/insertionFactory')
vi.mock('../src/RendererContext', () => ({
    useRenderer: mocks.mockUseRenderer
}))

describe('makeStaticStyles', () => {
    beforeEach(() => {
        vi.resetAllMocks()

        // 重置模拟函数的返回值
        mocks.mockUseRenderer.mockReturnValue(mocks.mockRenderer)
        mocks.mockVanillaMakeStaticStyles.mockReturnValue(vi.fn())
    })

    describe('非测试环境', () => {
        beforeEach(() => {
            // 模拟非测试环境
            vi.stubEnv('NODE_ENV', 'production')
        })

        it('应该返回一个useStaticStyles函数', () => {
            const styles = { body: { color: 'red' } }

            const useStaticStyles = makeStaticStyles(styles)

            // 验证返回的是一个函数
            expect(typeof useStaticStyles).toBe('function')
        })

        it('应该调用getStyles函数并传递正确的参数', () => {
            const styles = { body: { color: 'red' } }

            const useStaticStyles = makeStaticStyles(styles)
            useStaticStyles()

            // 获取vanillaMakeStaticStyles返回的函数
            const getStyles = mocks.mockVanillaMakeStaticStyles.mock.results[0].value

            // 验证getStyles被调用，并传递了正确的参数
            expect(getStyles).toHaveBeenCalledWith({
                renderer: mocks.mockRenderer
            })
        })

        it('应该处理数组形式的样式', () => {
            const styles: GriffelStaticStyles[] = [
                { body: { color: 'red' } },
                { div: { margin: 0 } }
            ]

            const useStaticStyles = makeStaticStyles(styles)
            useStaticStyles()

            // 验证vanillaMakeStaticStyles被调用，并传递了正确的参数
            expect(mocks.mockVanillaMakeStaticStyles).toHaveBeenCalledWith(styles, expect.any(Function))
        })

        it('应该在组件内部调用useStaticStyles时正常工作', () => {
            const styles = { body: { color: 'red' } }

            const useStaticStyles = makeStaticStyles(styles)

            // 创建一个测试组件来使用useStaticStyles
            const TestComponent = defineComponent({
                setup() {
                    useStaticStyles()
                    return {}
                },
                template: '<div>Test</div>'
            })

            const wrapper = mount(TestComponent)

            // 验证组件能够正常渲染
            expect(wrapper.exists()).toBe(true)

            // 获取vanillaMakeStaticStyles返回的函数
            const getStyles = mocks.mockVanillaMakeStaticStyles.mock.results[0].value

            // 验证getStyles被调用
            expect(getStyles).toHaveBeenCalledWith({
                renderer: mocks.mockRenderer
            })
        })
    })

    describe('测试环境', () => {
        beforeEach(() => {
            // 模拟测试环境
            vi.stubEnv('NODE_ENV', 'test')
        })

        it('应该返回一个空函数', () => {
            const styles = { body: { color: 'red' } }

            const useStaticStyles = makeStaticStyles(styles)

            // 验证返回的是一个函数
            expect(typeof useStaticStyles).toBe('function')

            // 调用函数，不应该抛出错误
            expect(() => useStaticStyles()).not.toThrow()

            // 获取vanillaMakeStaticStyles返回的函数
            const getStyles = mocks.mockVanillaMakeStaticStyles.mock.results[0].value

            // 验证getStyles没有被调用（在测试环境中）
            expect(getStyles).not.toHaveBeenCalled()
        })

        it('应该处理数组形式的样式', () => {
            const styles: GriffelStaticStyles[] = [
                { body: { color: 'red' } },
                { div: { margin: 0 } }
            ]

            const useStaticStyles = makeStaticStyles(styles)

            // 验证返回的是一个函数
            expect(typeof useStaticStyles).toBe('function')

            // 调用函数，不应该抛出错误
            expect(() => useStaticStyles()).not.toThrow()

            // 验证vanillaMakeStaticStyles被调用，并传递了正确的参数
            expect(mocks.mockVanillaMakeStaticStyles).toHaveBeenCalledWith(styles, expect.any(Function))
        })
    })

    describe('参数传递', () => {
        beforeEach(() => {
            // 模拟非测试环境
            vi.stubEnv('NODE_ENV', 'production')
        })

        it('应该将正确的参数传递给vanillaMakeStaticStyles', () => {
            const styles = { body: { color: 'red' } }

            makeStaticStyles(styles)

            // 验证vanillaMakeStaticStyles被调用，并传递了正确的参数
            expect(mocks.mockVanillaMakeStaticStyles).toHaveBeenCalledWith(styles, expect.any(Function))
        })
    })
})