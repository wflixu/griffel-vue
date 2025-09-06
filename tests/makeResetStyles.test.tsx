import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent } from 'vue'
import { makeResetStyles } from '../src/makeResetStyles'


// 使用 vi.hoisted 来定义需要在 mock 中使用的变量
const mocks = vi.hoisted(() => {
  return {
    mockVanillaMakeResetStyles: vi.fn().mockReturnValue(vi.fn().mockReturnValue('reset-class')),
    mockUseRenderer: vi.fn(),
    mockUseTextDirection: vi.fn(),
    mockIsInsideComponent: vi.fn(),
    mockRenderer: {
      id: 'test-renderer',
      insertCSSRules: vi.fn()
    }
  }
})

// 模拟依赖模块
vi.mock('@griffel/core', () => ({
  makeResetStyles: mocks.mockVanillaMakeResetStyles
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

describe('makeResetStyles', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    // 重置模拟函数的返回值
    mocks.mockUseRenderer.mockReturnValue(mocks.mockRenderer)
    mocks.mockUseTextDirection.mockReturnValue('ltr')
    mocks.mockIsInsideComponent.mockReturnValue(false)
    mocks.mockVanillaMakeResetStyles.mockReturnValue(vi.fn().mockReturnValue('reset-class'))
  })

  describe('生产环境', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'production')
    })

    it('应该返回一个useClassName函数', () => {
      const styles = { color: 'red' }

      const useClassName = makeResetStyles(styles)

      // 验证返回的是一个函数
      expect(typeof useClassName).toBe('function')
    })

    it('useClassName应该返回正确的类名', () => {
      const styles = { color: 'red' }

      const useClassName = makeResetStyles(styles)
      const className = useClassName()

      // 验证返回了正确的类名
      expect(className).toBe('reset-class')
    })

    it('应该在组件内部调用useClassName时正常工作', () => {
      const styles = { color: 'red' }

      const useClassName = makeResetStyles(styles)

      // 创建一个测试组件来使用useClassName
      const TestComponent = defineComponent({
        setup() {
          const className = useClassName()
          return { className }
        },
        template: '<div :class="className">Test</div>'
      })

      const wrapper = mount(TestComponent)

      // 验证组件能够正常渲染
      expect(wrapper.exists()).toBe(true)
      expect(wrapper.vm.className).toBe('reset-class')
    })
  })

  describe('开发环境', () => {
    beforeEach(() => {
      vi.stubEnv('NODE_ENV', 'development')
    })

    it('在组件外部调用时应该正常工作', () => {
      // 模拟在组件外部
      mocks.mockIsInsideComponent.mockReturnValue(false)

      const styles = { color: 'red' }

      // 不应该抛出错误
      expect(() => makeResetStyles(styles)).not.toThrow()
    })

    it('在组件内部调用时应该抛出错误', () => {
      // 模拟在组件内部
      mocks.mockIsInsideComponent.mockReturnValue(true)

      const styles = { color: 'red' }

      // 应该抛出错误
      expect(() => makeResetStyles(styles)).toThrowError(
        "makeResetStyles(): this function cannot be called in component's scope. All makeResetStyles() calls should be top level i.e. in a root scope of a file."
      )
    })
  })

  describe('参数传递', () => {
    it('应该将正确的参数传递给vanillaMakeResetStyles', () => {
      const styles = { color: 'red' }

      makeResetStyles(styles)

      // 验证vanillaMakeResetStyles被调用，并传递了正确的参数
      expect(mocks.mockVanillaMakeResetStyles).toHaveBeenCalledWith(styles, expect.any(Function))
    })

    it('应该将dir和renderer传递给getStyles函数', () => {
      const styles = { color: 'red' }

      const useClassName = makeResetStyles(styles)

      // 模拟不同的文本方向和渲染器
      mocks.mockUseTextDirection.mockReturnValue('rtl')
      const customRenderer = {
        id: 'custom-renderer',
        insertCSSRules: vi.fn()
      }
      mocks.mockUseRenderer.mockReturnValue(customRenderer)

      // 调用useClassName
      useClassName()

      // 获取vanillaMakeResetStyles返回的函数
      const getStyles = mocks.mockVanillaMakeResetStyles.mock.results[0].value

      // 验证getStyles被调用，并传递了正确的参数
      expect(getStyles).toHaveBeenCalledWith({
        dir: 'rtl',
        renderer: customRenderer
      })
    })
  })
})