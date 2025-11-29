import { describe, it, expect, vi, beforeEach } from 'vitest'
import { __styles } from '../src/__styles'

const mocks = vi.hoisted(() => {
  const mockInsertionFactory = vi.fn()
  const mockRenderer = {
    id: 'test-renderer',
    insertCSSRules: vi.fn()
  }
  const mockVanillaStyles = vi.fn()
  const mockGetStyles = vi.fn().mockReturnValue({
    root: 'class1',
    slot1: 'class2'
  })
  mockVanillaStyles.mockReturnValue(mockGetStyles)

  return {
    mockVanillaStyles,
    mockGetStyles,
    mockInsertionFactory,
    mockUseRenderer: vi.fn().mockReturnValue(mockRenderer),
    mockUseTextDirection: vi.fn().mockReturnValue('ltr'),
    mockRenderer
  }
})

vi.mock('@griffel/core', () => ({
  __styles: mocks.mockVanillaStyles
}))

vi.mock('../src/insertionFactory', () => ({
  insertionFactory: mocks.mockInsertionFactory
}))

vi.mock('../src/RendererContext', () => ({
  useRenderer: mocks.mockUseRenderer
}))

vi.mock('../src/TextDirectionContext', () => ({
  useTextDirection: mocks.mockUseTextDirection
}))

describe('__styles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a useClasses function that returns classes with direction and renderer', () => {
    const classesMapBySlot = {
      root: 'class1',
      slot1: 'class2'
    }
    const cssRules = {
      b: ['body { margin: 0; }'],
      h: ['.header { font-size: 16px; }']
    }

    const useClasses = __styles(classesMapBySlot, cssRules)
    expect(typeof useClasses).toBe('function')

    const result = useClasses()

    expect(mocks.mockVanillaStyles).toHaveBeenCalledWith(classesMapBySlot, cssRules, mocks.mockInsertionFactory)
    expect(mocks.mockUseTextDirection).toHaveBeenCalled()
    expect(mocks.mockUseRenderer).toHaveBeenCalled()
    expect(mocks.mockGetStyles).toHaveBeenCalledWith({ dir: 'ltr', renderer: mocks.mockRenderer })
    expect(result).toEqual({
      root: 'class1',
      slot1: 'class2'
    })
  })

  it('should work with RTL text direction', () => {
    mocks.mockUseTextDirection.mockReturnValue('rtl')

    const classesMapBySlot = {
      button: 'button-rtl'
    }
    const cssRules = { h: ['.button { text-align: right; }'] }

    const useClasses = __styles(classesMapBySlot, cssRules)
    const result = useClasses()

    expect(mocks.mockUseTextDirection).toHaveBeenCalled()
    expect(mocks.mockGetStyles).toHaveBeenCalledWith({ dir: 'rtl', renderer: mocks.mockRenderer })
  })

  it('should pass correct parameters to vanillaStyles', () => {
    const classesMapBySlot = { root: 'root-class' }
    const cssRules = { b: ['body rules'], h: ['header rules'] }

    __styles(classesMapBySlot, cssRules)

    expect(mocks.mockVanillaStyles).toHaveBeenCalledTimes(1)
    expect(mocks.mockVanillaStyles).toHaveBeenCalledWith(
      classesMapBySlot,
      cssRules,
      mocks.mockInsertionFactory
    )
  })

  it('should handle empty CSS rules', () => {
    mocks.mockGetStyles.mockReturnValue({ root: 'class' })
    const classesMapBySlot = { root: 'class' }
    const cssRules = {}

    const useClasses = __styles(classesMapBySlot, cssRules)
    const result = useClasses()

    expect(result).toEqual({ root: 'class' })
    expect(mocks.mockVanillaStyles).toHaveBeenCalledWith(classesMapBySlot, cssRules, mocks.mockInsertionFactory)
  })

  it('should handle complex CSS rules structure', () => {
    const classesMapBySlot = {
      root: 'root-class',
      header: 'header-class',
      content: 'content-class'
    }
    const cssRules = {
      b: ['body { margin: 0; }'],
      h: ['@media print { .header { display: none; } }'],
      t: ['@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }'],
      s: ['.content { font-weight: bold; }']
    }

    mocks.mockGetStyles.mockReturnValue(classesMapBySlot)

    const useClasses = __styles(classesMapBySlot, cssRules)
    const result = useClasses()

    expect(result).toEqual(classesMapBySlot)
    expect(mocks.mockVanillaStyles).toHaveBeenCalledWith(classesMapBySlot, cssRules, mocks.mockInsertionFactory)
  })

  it('should use the same renderer instance across multiple calls', () => {
    const classesMapBySlot = { button: 'btn' }
    const cssRules = { h: ['.btn { color: blue; }'] }

    const useClasses = __styles(classesMapBySlot, cssRules)

    // Call multiple times
    useClasses()
    useClasses()
    useClasses()

    // Should use the same renderer each time
    expect(mocks.mockUseRenderer).toHaveBeenCalledTimes(3)
    expect(mocks.mockGetStyles).toHaveBeenCalledTimes(3)
  })
})