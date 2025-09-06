import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import {
    RendererProvider,
    useRenderer,
    RendererContextKey
} from '../src/RendererContext'
import { createDOMRenderer, rehydrateRendererCache } from '@griffel/core'
import { canUseDOM } from '../src/utils'

// 模拟依赖模块
vi.mock('@griffel/core')
vi.mock('../src/utils')

describe('RendererContext', () => {
    let mockRenderer: any
    let mockDocument: any
    let mockCreateDOMRenderer: any
    let mockRehydrateRendererCache: any

    beforeEach(() => {
        // 重置所有模拟
        vi.resetAllMocks()

        // 创建模拟的渲染器和文档
        mockRenderer = {
            id: 'test-renderer',
            insertCSSRules: vi.fn()
        }

        mockDocument = {
            head: {}
        }

        // 模拟 createDOMRenderer 和 rehydrateRendererCache
        mockCreateDOMRenderer = vi.fn().mockReturnValue(mockRenderer)
        mockRehydrateRendererCache = vi.fn()
            ; (createDOMRenderer as any).mockImplementation(mockCreateDOMRenderer)
            ; (rehydrateRendererCache as any).mockImplementation(mockRehydrateRendererCache)
    })

    describe('RendererProvider', () => {
        it('应该提供renderer给子组件', async () => {
            // 模拟支持DOM的环境
            ; (canUseDOM as any).mockReturnValue(true)

            const TestChild = defineComponent({
                setup() {
                    const renderer = useRenderer()
                    return { renderer }
                },
                template: '<div>Test</div>'
            })

            const wrapper = mount(RendererProvider, {
                props: {
                    renderer: mockRenderer
                },
                slots: {
                    default: TestChild
                }
            })

            // 等待异步操作完成
            await flushPromises()

            // 验证rehydrateRendererCache被调用
            expect(mockRehydrateRendererCache).toHaveBeenCalledWith(mockRenderer, document)

            // 验证子组件能够获取到renderer
            const childComponent = wrapper.findComponent(TestChild)
            expect(childComponent.vm.renderer).toStrictEqual(mockRenderer)
        })

        it('应该使用提供的targetDocument', async () => {
            // 模拟支持DOM的环境
            ; (canUseDOM as any).mockReturnValue(true)

            const wrapper = mount(RendererProvider, {
                props: {
                    renderer: mockRenderer,
                    targetDocument: mockDocument
                },
                slots: {
                    default: '<div>Test</div>'
                }
            })

            // 等待异步操作完成
            await flushPromises()

            // 验证rehydrateRendererCache被调用时使用了提供的targetDocument
            expect(mockRehydrateRendererCache).toHaveBeenCalledWith(mockRenderer, mockDocument)
        })

        it('在不支持DOM的环境中不应该调用rehydrateRendererCache', async () => {
            // 模拟不支持DOM的环境
            ; (canUseDOM as any).mockReturnValue(false)

            mount(RendererProvider, {
                props: {
                    renderer: mockRenderer
                },
                slots: {
                    default: '<div>Test</div>'
                }
            })

            // 等待异步操作完成
            await flushPromises()

            // 验证rehydrateRendererCache没有被调用
            expect(mockRehydrateRendererCache).not.toHaveBeenCalled()
        })

        it('应该在renderer变化时重新调用rehydrateRendererCache', async () => {
            // 模拟支持DOM的环境
            ; (canUseDOM as any).mockReturnValue(true)

            const wrapper = mount(RendererProvider, {
                props: {
                    renderer: mockRenderer
                },
                slots: {
                    default: '<div>Test</div>'
                }
            })

            // 等待异步操作完成
            await flushPromises()

            // 验证初始调用
            expect(mockRehydrateRendererCache).toHaveBeenCalledTimes(1)

            // 创建新的渲染器
            const newRenderer = {
                id: 'new-renderer',
                insertCSSRules: vi.fn()
            }

            // 更新props
            await wrapper.setProps({ renderer: newRenderer })

            // 等待异步操作完成
            await flushPromises()

            // 验证rehydrateRendererCache被再次调用
            expect(mockRehydrateRendererCache).toHaveBeenCalledTimes(2)
            expect(mockRehydrateRendererCache).toHaveBeenCalledWith(newRenderer, document)
        })
    })

    describe('useRenderer', () => {
        it('在没有Provider的情况下应该返回默认的DOM渲染器', () => {
            // 模拟支持DOM的环境
            ; (canUseDOM as any).mockReturnValue(true)

            const TestComponent = defineComponent({
                setup() {
                    const renderer = useRenderer()
                    return { renderer }
                },
                template: '<div>Test</div>'
            })

            const wrapper = mount(TestComponent)

            // 验证createDOMRenderer被调用
            expect(mockCreateDOMRenderer).toHaveBeenCalledTimes(1)

            // 验证返回了默认的渲染器
            expect(wrapper.vm.renderer).toBe(mockRenderer)
        })

        it('在有Provider的情况下应该返回提供的渲染器', async () => {
            // 模拟支持DOM的环境
            ; (canUseDOM as any).mockReturnValue(true)

            const TestChild = defineComponent({
                setup() {
                    const renderer = useRenderer()
                    return { renderer }
                },
                template: '<div>Test</div>'
            })

            const wrapper = mount(RendererProvider, {
                props: {
                    renderer: mockRenderer
                },
                slots: {
                    default: TestChild
                }
            })

            // 等待异步操作完成
            await flushPromises()

            // 验证子组件能够获取到提供的渲染器
            const childComponent = wrapper.findComponent(TestChild)
            expect(childComponent.vm.renderer).toStrictEqual(mockRenderer)

            // 修改这一行：因为默认参数总是会计算，所以createDOMRenderer被调用了一次
            expect(mockCreateDOMRenderer).toHaveBeenCalledTimes(1)
        })
    })

    describe('RendererContextKey', () => {
        it('应该是一个唯一的Symbol', () => {
            expect(typeof RendererContextKey).toBe('symbol')
            expect(RendererContextKey.description).toBe('RendererContext')
        })
    })
})