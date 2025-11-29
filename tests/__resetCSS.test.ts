import { describe, it, expect, vi, beforeEach } from 'vitest'
import { __resetCSS } from '../src/__resetCSS'

const mocks = vi.hoisted(() => {
  const mockVanillaResetCSS = vi.fn()
  const mockGetStyles = vi.fn().mockReturnValue('reset-class')
  mockVanillaResetCSS.mockReturnValue(mockGetStyles)

  return {
    mockVanillaResetCSS,
    mockGetStyles,
    mockUseTextDirection: vi.fn().mockReturnValue('ltr')
  }
})

vi.mock('@griffel/core', () => ({
  __resetCSS: mocks.mockVanillaResetCSS
}))

vi.mock('../src/TextDirectionContext', () => ({
  useTextDirection: mocks.mockUseTextDirection
}))

describe('__resetCSS', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a useClasses function that returns reset class with text direction', () => {
    const ltrClassName = 'reset-ltr'
    const rtlClassName = 'reset-rtl'

    const useClasses = __resetCSS(ltrClassName, rtlClassName)
    expect(typeof useClasses).toBe('function')

    const result = useClasses()

    expect(mocks.mockVanillaResetCSS).toHaveBeenCalledWith(ltrClassName, rtlClassName)
    expect(mocks.mockUseTextDirection).toHaveBeenCalled()
    expect(mocks.mockGetStyles).toHaveBeenCalledWith({ dir: 'ltr' })
    expect(result).toBe('reset-class')
  })

  it('should work with RTL text direction', () => {
    mocks.mockUseTextDirection.mockReturnValue('rtl')
    mocks.mockGetStyles.mockReturnValue('reset-rtl')

    const ltrClassName = 'reset-ltr'
    const rtlClassName = 'reset-rtl'

    const useClasses = __resetCSS(ltrClassName, rtlClassName)
    const result = useClasses()

    expect(mocks.mockUseTextDirection).toHaveBeenCalled()
    expect(mocks.mockGetStyles).toHaveBeenCalledWith({ dir: 'rtl' })
    expect(result).toBe('reset-rtl')
  })

  it('should handle null RTL class name', () => {
    mocks.mockGetStyles.mockReturnValue('reset-class')
    const ltrClassName = 'reset-only'
    const rtlClassName = null

    const useClasses = __resetCSS(ltrClassName, rtlClassName)
    const result = useClasses()

    expect(mocks.mockVanillaResetCSS).toHaveBeenCalledWith(ltrClassName, rtlClassName)
    expect(result).toBe('reset-class')
  })

  it('should pass correct parameters to vanillaResetCSS', () => {
    const ltrClassName = 'my-reset-ltr'
    const rtlClassName = null

    __resetCSS(ltrClassName, rtlClassName)

    expect(mocks.mockVanillaResetCSS).toHaveBeenCalledTimes(1)
    expect(mocks.mockVanillaResetCSS).toHaveBeenCalledWith(ltrClassName, rtlClassName)
  })

  it('should work with different class names', () => {
    const ltrClassName = 'custom-reset-ltr'
    const rtlClassName = 'custom-reset-rtl'

    mocks.mockGetStyles.mockReturnValue('custom-reset-class')

    const useClasses = __resetCSS(ltrClassName, rtlClassName)
    const result = useClasses()

    expect(mocks.mockVanillaResetCSS).toHaveBeenCalledWith(ltrClassName, rtlClassName)
    expect(result).toBe('custom-reset-class')
  })

  it('should handle empty string class names', () => {
    const ltrClassName = ''
    const rtlClassName = ''

    mocks.mockGetStyles.mockReturnValue('')

    const useClasses = __resetCSS(ltrClassName, rtlClassName)
    const result = useClasses()

    expect(mocks.mockVanillaResetCSS).toHaveBeenCalledWith('', '')
    expect(result).toBe('')
  })

  it('should consistently return the same class for multiple calls', () => {
    const ltrClassName = 'consistent-reset'
    const rtlClassName = null

    mocks.mockGetStyles.mockReturnValue('consistent-class')

    const useClasses = __resetCSS(ltrClassName, rtlClassName)

    const result1 = useClasses()
    const result2 = useClasses()
    const result3 = useClasses()

    expect(result1).toBe(result2)
    expect(result2).toBe(result3)
    expect(result1).toBe('consistent-class')
  })
})