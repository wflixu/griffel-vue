import { describe, it, expect, vi, beforeEach } from 'vitest'
import { makeStyles } from '../src/makeStyles'

// 使用 vi.hoisted 来定义需要在 mock 中使用的变量
const mocks = vi.hoisted(() => {
  return {
    mockVanillaMakeStyles: vi.fn().mockReturnValue(vi.fn().mockReturnValue({
      slot1: 'class1',
      slot2: 'class2'
    })),
    mockUseRenderer: vi.fn(),
    mockUseTextDirection: vi.fn(),
    mockIsInsideComponent: vi.fn(),
    mockRenderer: {
      id: 'test-renderer',
      insertCSSRules: vi.fn()
    }
  }
})

// 模拟依赖模块 - 在 hoisted 之后
vi.mock('@griffel/core', () => ({
  makeStyles: mocks.mockVanillaMakeStyles
}))

vi.mock('../src/insertionFactory')
vi.mock('../src/RendererContext', () => ({
  useRenderer: mocks.mockUseRenderer
}))
vi.mock('../src/TextDirectionContext', () => ({
  useTextDirection: mocks.mockUseTextDirection
}))
vi.mock('../src/utils', () => ({
  isInsideComponent: mocks.mockIsInsideComponent
}))

describe('makeStyles', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    // 重置模拟函数的返回值
    mocks.mockUseRenderer.mockReturnValue(mocks.mockRenderer)
    mocks.mockUseTextDirection.mockReturnValue('ltr')
    mocks.mockIsInsideComponent.mockReturnValue(false)
    mocks.mockVanillaMakeStyles.mockReturnValue(vi.fn().mockReturnValue({
      slot1: 'class1',
      slot2: 'class2'
    }))
  })

  describe('生产环境', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'production')
    })

    it('应该返回一个useClasses函数', () => {
      const styles = {
        slot1: { color: 'red' },
        slot2: { color: 'blue' }
      }

      const useClasses = makeStyles(styles)
      expect(typeof useClasses).toBe('function')
    })

    it('useClasses应该返回正确的类名', () => {
      const styles = {
        slot1: { color: 'red' },
        slot2: { color: 'blue' }
      }

      const useClasses = makeStyles(styles)
      const classes = useClasses()

      expect(classes).toEqual({
        slot1: 'class1',
        slot2: 'class2'
      })
    })
  })

  describe('开发环境', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'development')
    })

    it('在组件外部调用时应该正常工作', () => {
      mocks.mockIsInsideComponent.mockReturnValue(false)

      const styles = {
        slot1: { color: 'red' }
      }

      expect(() => makeStyles(styles)).not.toThrow()
    })

    it('在组件内部调用时应该抛出错误', () => {
      mocks.mockIsInsideComponent.mockReturnValue(true)

      const styles = {
        slot1: { color: 'red' }
      }

      expect(() => makeStyles(styles)).toThrowError(
        "makeStyles(): this function cannot be called in component's scope. All makeStyles() calls should be top level i.e. in a root scope of a file."
      )
    })
  })

  describe('参数传递', () => {
    it('应该将正确的参数传递给vanillaMakeStyles', () => {
      const styles = {
        slot1: { color: 'red' },
        slot2: { color: 'blue' }
      }

      makeStyles(styles)

      expect(mocks.mockVanillaMakeStyles).toHaveBeenCalledWith(styles, expect.any(Function))
    })
  })
})