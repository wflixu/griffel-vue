import { describe, it, expect, vi, beforeEach } from 'vitest'
import { __resetStyles } from '../src/__resetStyles'

const mocks = vi.hoisted(() => {
  const mockInsertionFactory = vi.fn()
  const mockRenderer = {
    id: 'test-renderer',
    insertCSSRules: vi.fn()
  }
  const mockVanillaResetStyles = vi.fn()
  const mockGetStyles = vi.fn().mockReturnValue('reset-styles-class')
  mockVanillaResetStyles.mockReturnValue(mockGetStyles)

  return {
    mockVanillaResetStyles,
    mockGetStyles,
    mockInsertionFactory,
    mockUseRenderer: vi.fn().mockReturnValue(mockRenderer),
    mockUseTextDirection: vi.fn().mockReturnValue('ltr'),
    mockRenderer
  }
})

vi.mock('@griffel/core', () => ({
  __resetStyles: mocks.mockVanillaResetStyles
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

describe('__resetStyles', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a useClasses function that returns reset class with direction and renderer', () => {
    const ltrClassName = 'reset-ltr'
    const rtlClassName = 'reset-rtl'
    const cssRules = {
      b: ['body { margin: 0; }'],
      h: ['.header { font-size: 16px; }']
    }

    const useClasses = __resetStyles(ltrClassName, rtlClassName, cssRules)
    expect(typeof useClasses).toBe('function')

    const result = useClasses()

    expect(mocks.mockVanillaResetStyles).toHaveBeenCalledWith(
      ltrClassName,
      rtlClassName,
      cssRules,
      mocks.mockInsertionFactory
    )
    expect(mocks.mockUseTextDirection).toHaveBeenCalled()
    expect(mocks.mockUseRenderer).toHaveBeenCalled()
    expect(mocks.mockGetStyles).toHaveBeenCalledWith({ dir: 'ltr', renderer: mocks.mockRenderer })
    expect(result).toBe('reset-styles-class')
  })

  it('should work with RTL text direction', () => {
    mocks.mockUseTextDirection.mockReturnValue('rtl')
    mocks.mockGetStyles.mockReturnValue('reset-rtl-class')

    const ltrClassName = 'reset-ltr'
    const rtlClassName = 'reset-rtl'
    const cssRules = { h: ['.reset { text-align: right; }'] }

    const useClasses = __resetStyles(ltrClassName, rtlClassName, cssRules)
    const result = useClasses()

    expect(mocks.mockUseTextDirection).toHaveBeenCalled()
    expect(mocks.mockGetStyles).toHaveBeenCalledWith({ dir: 'rtl', renderer: mocks.mockRenderer })
    expect(result).toBe('reset-rtl-class')
  })

  it('should handle null RTL class name', () => {
    mocks.mockGetStyles.mockReturnValue('reset-styles-class')
    const ltrClassName = 'reset-only'
    const rtlClassName = null
    const cssRules = { h: ['.reset { margin: 0; }'] }

    const useClasses = __resetStyles(ltrClassName, rtlClassName, cssRules)
    const result = useClasses()

    expect(mocks.mockVanillaResetStyles).toHaveBeenCalledWith(
      ltrClassName,
      rtlClassName,
      cssRules,
      mocks.mockInsertionFactory
    )
    expect(result).toBe('reset-styles-class')
  })

  it('should pass correct parameters to vanillaResetStyles', () => {
    const ltrClassName = 'my-reset-ltr'
    const rtlClassName = null
    const cssRules = { b: ['body rules'], h: ['header rules'] }

    __resetStyles(ltrClassName, rtlClassName, cssRules)

    expect(mocks.mockVanillaResetStyles).toHaveBeenCalledTimes(1)
    expect(mocks.mockVanillaResetStyles).toHaveBeenCalledWith(
      ltrClassName,
      rtlClassName,
      cssRules,
      mocks.mockInsertionFactory
    )
  })

  it('should handle CSS rules as array', () => {
    mocks.mockGetStyles.mockReturnValue('reset-styles-class')
    const ltrClassName = 'reset-array'
    const rtlClassName = null
    const cssRules = ['.reset { padding: 0; }', '.reset { box-sizing: border-box; }']

    const useClasses = __resetStyles(ltrClassName, rtlClassName, cssRules)
    const result = useClasses()

    expect(mocks.mockVanillaResetStyles).toHaveBeenCalledWith(
      ltrClassName,
      rtlClassName,
      cssRules,
      mocks.mockInsertionFactory
    )
    expect(result).toBe('reset-styles-class')
  })

  it('should handle complex CSS rules structure', () => {
    const ltrClassName = 'complex-reset'
    const rtlClassName = 'complex-reset-rtl'
    const cssRules = {
      b: ['body { margin: 0; }'],
      h: ['@media print { .reset { display: none; } }'],
      t: ['@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }'],
      s: ['.reset { font-weight: bold; }']
    }

    mocks.mockGetStyles.mockReturnValue('complex-reset-class')

    const useClasses = __resetStyles(ltrClassName, rtlClassName, cssRules)
    const result = useClasses()

    expect(mocks.mockVanillaResetStyles).toHaveBeenCalledWith(
      ltrClassName,
      rtlClassName,
      cssRules,
      mocks.mockInsertionFactory
    )
    expect(result).toBe('complex-reset-class')
  })

  it('should use the same renderer instance across multiple calls', () => {
    const ltrClassName = 'reset-button'
    const rtlClassName = null
    const cssRules = { h: ['.reset-button { border: none; }'] }

    const useClasses = __resetStyles(ltrClassName, rtlClassName, cssRules)

    // Call multiple times
    useClasses()
    useClasses()
    useClasses()

    // Should use the same renderer each time
    expect(mocks.mockUseRenderer).toHaveBeenCalledTimes(3)
    expect(mocks.mockGetStyles).toHaveBeenCalledTimes(3)
  })

  it('should work with empty CSS rules object', () => {
    mocks.mockGetStyles.mockReturnValue('reset-styles-class')
    const ltrClassName = 'empty-reset'
    const rtlClassName = null
    const cssRules = {}

    const useClasses = __resetStyles(ltrClassName, rtlClassName, cssRules)
    const result = useClasses()

    expect(mocks.mockVanillaResetStyles).toHaveBeenCalledWith(
      ltrClassName,
      rtlClassName,
      cssRules,
      mocks.mockInsertionFactory
    )
    expect(result).toBe('reset-styles-class')
  })
})