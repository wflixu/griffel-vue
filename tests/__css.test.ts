import { describe, it, expect, vi, beforeEach } from 'vitest'
import { __css } from '../src/__css'

const mocks = vi.hoisted(() => {
  const mockVanillaCSS = vi.fn()
  const mockGetStyles = vi.fn().mockReturnValue({
    root: 'class1',
    slot1: 'class2'
  })
  mockVanillaCSS.mockReturnValue(mockGetStyles)

  return {
    mockVanillaCSS,
    mockGetStyles,
    mockUseTextDirection: vi.fn().mockReturnValue('ltr')
  }
})

vi.mock('@griffel/core', () => ({
  __css: mocks.mockVanillaCSS
}))

vi.mock('../src/TextDirectionContext', () => ({
  useTextDirection: mocks.mockUseTextDirection
}))

describe('__css', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create a useClasses function that returns classes with text direction', () => {
    const classesMapBySlot = {
      root: 'class1',
      slot1: 'class2'
    }

    const useClasses = __css(classesMapBySlot)
    expect(typeof useClasses).toBe('function')

    const result = useClasses()
    expect(mocks.mockVanillaCSS).toHaveBeenCalledWith(classesMapBySlot)
    expect(mocks.mockUseTextDirection).toHaveBeenCalled()
    expect(mocks.mockGetStyles).toHaveBeenCalledWith({ dir: 'ltr' })
    expect(result).toEqual({
      root: 'class1',
      slot1: 'class2'
    })
  })

  it('should work with different text directions', () => {
    mocks.mockUseTextDirection.mockReturnValue('rtl')
    mocks.mockGetStyles.mockReturnValue({
      button: 'button-rtl'
    })

    const classesMapBySlot = {
      button: 'button-rtl'
    }

    const useClasses = __css(classesMapBySlot)
    const result = useClasses()

    expect(mocks.mockUseTextDirection).toHaveBeenCalled()
    expect(mocks.mockGetStyles).toHaveBeenCalledWith({ dir: 'rtl' })
    expect(result).toEqual({
      button: 'button-rtl'
    })
  })

  it('should handle empty classes map', () => {
    mocks.mockGetStyles.mockReturnValue({})
    const classesMapBySlot = {}

    const useClasses = __css(classesMapBySlot)
    const result = useClasses()

    expect(result).toEqual({})
    expect(mocks.mockVanillaCSS).toHaveBeenCalledWith({})
  })

  it('should handle multiple slots correctly', () => {
    const classesMapBySlot = {
      root: 'root-class',
      header: 'header-class',
      content: 'content-class',
      footer: 'footer-class'
    }

    mocks.mockVanillaCSS.mockReturnValue(vi.fn().mockReturnValue(classesMapBySlot))

    const useClasses = __css(classesMapBySlot)
    const result = useClasses()

    expect(result).toEqual(classesMapBySlot)
    expect(mocks.mockVanillaCSS).toHaveBeenCalledWith(classesMapBySlot)
  })
})