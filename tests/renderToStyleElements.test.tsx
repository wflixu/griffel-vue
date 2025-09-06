import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderToStyleElements } from '../src/renderToStyleElements'

// 模拟依赖模块
vi.mock('@griffel/core', () => ({
  styleBucketOrdering: ['a', 'b', 'c', 'd', 'e']
}))

describe('renderToStyleElements', () => {
  let mockRenderer: any

  beforeEach(() => {
    // 重置所有模拟
    vi.resetAllMocks()

    // 创建模拟的渲染器
    mockRenderer = {
      stylesheets: {},
      compareMediaQueries: vi.fn().mockImplementation((a, b) => {
        // 简单的媒体查询比较逻辑
        if (a === b) return 0
        return a < b ? -1 : 1
      })
    }
  })

  it('应该返回空数组当没有样式表时', () => {
    mockRenderer.stylesheets = {}

    const result = renderToStyleElements(mockRenderer)

    expect(result).toEqual([])
  })

  it('应该过滤掉没有CSS规则的样式表', () => {
    mockRenderer.stylesheets = {
      sheet1: {
        bucketName: 'a',
        elementAttributes: {},
        cssRules: vi.fn().mockReturnValue([]) // 空规则
      },
      sheet2: {
        bucketName: 'b',
        elementAttributes: {},
        cssRules: vi.fn().mockReturnValue(['body { color: red; }']) // 有规则
      }
    }

    const result = renderToStyleElements(mockRenderer)

    // 应该只返回一个有规则的样式表
    expect(result).toHaveLength(1)
    expect(result[0]!.props!.innerHTML).toBe('body { color: red; }')
  })

  it('应该按桶名称排序样式表', () => {
    mockRenderer.stylesheets = {
      sheet1: {
        bucketName: 'c',
        elementAttributes: {},
        cssRules: vi.fn().mockReturnValue(['.c { color: red; }'])
      },
      sheet2: {
        bucketName: 'a',
        elementAttributes: {},
        cssRules: vi.fn().mockReturnValue(['.a { color: red; }'])
      },
      sheet3: {
        bucketName: 'b',
        elementAttributes: {},
        cssRules: vi.fn().mockReturnValue(['.b { color: red; }'])
      }
    }

    const result = renderToStyleElements(mockRenderer)

    // 应该按桶名称顺序排序: a, b, c
    expect(result).toHaveLength(3)
    expect(result[0]!.props!.innerHTML).toBe('.a { color: red; }')
    expect(result[1]!.props!.innerHTML).toBe('.b { color: red; }')
    expect(result[2]!.props!.innerHTML).toBe('.c { color: red; }')
  })

  it('应该按媒体查询排序样式表', () => {
    mockRenderer.stylesheets = {
      sheet1: {
        bucketName: 'a',
        elementAttributes: { media: '(min-width: 768px)' },
        cssRules: vi.fn().mockReturnValue(['@media (min-width: 768px) { .a { color: red; } }'])
      },
      sheet2: {
        bucketName: 'a',
        elementAttributes: { media: '(max-width: 480px)' },
        cssRules: vi.fn().mockReturnValue(['@media (max-width: 480px) { .a { color: red; } }'])
      },
      sheet3: {
        bucketName: 'a',
        elementAttributes: {},
        cssRules: vi.fn().mockReturnValue(['.a { color: red; }'])
      }
    }

    const result = renderToStyleElements(mockRenderer)

    // 应该先排序没有媒体查询的，然后按媒体查询排序
    expect(result).toHaveLength(3)
    expect(result[0]!.props!.media).toBeUndefined() // 没有媒体查询的应该排第一
    expect(result[1]!.props!.media).toBe('(max-width: 480px)')
    expect(result[2]!.props!.media).toBe('(min-width: 768px)')
  })

  it('应该正确处理具有相同桶名称和媒体查询的样式表', () => {
    mockRenderer.stylesheets = {
      sheet1: {
        bucketName: 'a',
        elementAttributes: { media: '(min-width: 768px)' },
        cssRules: vi.fn().mockReturnValue(['@media (min-width: 768px) { .a1 { color: red; } }'])
      },
      sheet2: {
        bucketName: 'a',
        elementAttributes: { media: '(min-width: 768px)' },
        cssRules: vi.fn().mockReturnValue(['@media (min-width: 768px) { .a2 { color: blue; } }'])
      }
    }

    const result = renderToStyleElements(mockRenderer)

    // 应该返回两个样式表，顺序可能任意（因为比较函数返回0）
    expect(result).toHaveLength(2)
  })

  it('应该创建正确的VNode结构', () => {
    mockRenderer.stylesheets = {
      sheet1: {
        bucketName: 'a',
        elementAttributes: { 'data-test': 'value' },
        cssRules: vi.fn().mockReturnValue(['body { color: red; }'])
      }
    }

    const result = renderToStyleElements(mockRenderer)

    // 应该返回一个VNode数组
    expect(result).toHaveLength(1)

    const vnode = result[0]

    // 验证VNode的属性
    expect(vnode!.type).toBe('style')
    expect(vnode!.props).toEqual({
      key: 'a',
      'data-test': 'value',
      'data-make-styles-rehydration': 'true',
      innerHTML: 'body { color: red; }'
    })
  })

  it('应该包含data-make-styles-rehydration属性', () => {
    mockRenderer.stylesheets = {
      sheet1: {
        bucketName: 'a',
        elementAttributes: {},
        cssRules: vi.fn().mockReturnValue(['body { color: red; }'])
      }
    }

    const result = renderToStyleElements(mockRenderer)

    // 应该包含data-make-styles-rehydration属性
    expect(result[0]!.props!['data-make-styles-rehydration']).toBe('true')
  })
})