
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { insertionFactory } from '../src/insertionFactory' // 请根据实际路径调整
import { useInsertionEffect } from '../src/useInsertionEffect'
import { canUseDOM } from '../src/utils'
import type { GriffelRenderer } from '@griffel/core'

// 模拟依赖模块
vi.mock('../src/useInsertionEffect')
vi.mock('../src/utils')

describe('insertionFactory', () => {
    let mockRenderer: any
    let mockCSSRules: any
    let mockInsertionEffect: any

    beforeEach(() => {
        // 重置所有模拟
        vi.resetAllMocks()

        // 创建模拟的渲染器和CSS规则
        mockRenderer = {
            id: 'test-renderer',
            insertCSSRules: vi.fn()
        }

        mockCSSRules = {
            main: ['body { color: red; }']
        }

        // 模拟 useInsertionEffect
        mockInsertionEffect = vi.fn()
            ; (useInsertionEffect as any).mockImplementation(mockInsertionEffect)
    })

    describe('在支持DOM和useInsertionEffect的环境中', () => {
        beforeEach(() => {
            // 模拟支持DOM和useInsertionEffect的环境
            ; (canUseDOM as any).mockReturnValue(true)
                ; (useInsertionEffect as any).mockImplementation(mockInsertionEffect)
        })

        it('应该使用useInsertionEffect来插入CSS规则', () => {
            const insert = insertionFactory()
            insert(mockRenderer, mockCSSRules)

            // 验证useInsertionEffect被调用
            expect(useInsertionEffect).toHaveBeenCalledTimes(1)

            // 验证useInsertionEffect的回调函数
            const effectCallback = mockInsertionEffect.mock.calls[0][0]
            effectCallback() // 执行回调

            // 验证insertCSSRules被调用
            expect(mockRenderer.insertCSSRules).toHaveBeenCalledWith(mockCSSRules)
        })

        it('应该传递正确的依赖数组给useInsertionEffect', () => {
            const insert = insertionFactory()
            insert(mockRenderer, mockCSSRules)

            // 验证依赖数组
            expect(mockInsertionEffect).toHaveBeenCalledWith(
                expect.any(Function),
                [mockRenderer, mockCSSRules]
            )
        })
    })

    describe('在不支持DOM或useInsertionEffect的环境中', () => {
        beforeEach(() => {
            // 模拟不支持DOM或useInsertionEffect的环境
            ; (canUseDOM as any).mockReturnValue(false)
                ; (useInsertionEffect as any).mockImplementation(undefined)
        })

        it('应该直接插入CSS规则', () => {
            const insert = insertionFactory()
            insert(mockRenderer, mockCSSRules)

            // 验证insertCSSRules被调用
            expect(mockRenderer.insertCSSRules).toHaveBeenCalledWith(mockCSSRules)
        })

        it('应该对同一渲染器只插入一次CSS规则', () => {
            const insert = insertionFactory()

            // 第一次调用
            insert(mockRenderer, mockCSSRules)
            expect(mockRenderer.insertCSSRules).toHaveBeenCalledTimes(1)

            // 第二次调用相同的渲染器
            insert(mockRenderer, mockCSSRules)

            // 验证insertCSSRules没有被再次调用
            expect(mockRenderer.insertCSSRules).toHaveBeenCalledTimes(1)
        })

        it('应该对不同渲染器分别插入CSS规则', () => {
            const insert = insertionFactory()

            // 第一个渲染器
            // 创建第一个渲染器，使用独立的 mock 函数
            const renderer1: GriffelRenderer = {
                id: 'renderer-1',
                insertCSSRules: vi.fn(),
                insertionCache: {},
                stylesheets: {},
                compareMediaQueries: () => 0
            }

            insert(renderer1, mockCSSRules)
            expect(renderer1.insertCSSRules).toHaveBeenCalledTimes(1)

            // 第二个渲染器
            const renderer2: GriffelRenderer = {
                id: 'renderer-2',
                insertCSSRules: vi.fn(),
                insertionCache: {},
                stylesheets: {},
                compareMediaQueries: () => 0
            }
            insert(renderer2, mockCSSRules)
            expect(renderer2.insertCSSRules).toHaveBeenCalledTimes(1)
        })
    })

    describe('边界情况', () => {
        it('应该处理undefined的CSS规则', () => {
            const insert = insertionFactory()

                // 模拟不支持DOM的环境
                ; (canUseDOM as any).mockReturnValue(false)

            // 使用undefined的CSS规则
            insert(mockRenderer, undefined as any)

            // 验证insertCSSRules被调用，但参数是undefined
            expect(mockRenderer.insertCSSRules).toHaveBeenCalledWith(undefined)
        })

        it('应该处理null的CSS规则', () => {
            const insert = insertionFactory()

                // 模拟不支持DOM的环境
                ; (canUseDOM as any).mockReturnValue(false)

            // 使用null的CSS规则
            insert(mockRenderer, null as any)

            // 验证insertCSSRules被调用，但参数是null
            expect(mockRenderer.insertCSSRules).toHaveBeenCalledWith(null)
        })
    })
})