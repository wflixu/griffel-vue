import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import {
    TextDirectionProvider,
    useTextDirection,
    TextDirectionContextKey,
    type TextDirection
} from '../src/TextDirectionContext'

describe('TextDirectionContext', () => {
    describe('TextDirectionProvider', () => {
        it('应该提供文本方向给子组件', () => {
            const TestChild = defineComponent({
                setup() {
                    const dir = useTextDirection()
                    return { dir }
                },
                template: '<div>{{ dir }}</div>'
            })

            const wrapper = mount(TextDirectionProvider, {
                props: {
                    dir: 'rtl' as TextDirection
                },
                slots: {
                    default: TestChild
                }
            })

            // 验证子组件能够获取到提供的文本方向
            const childComponent = wrapper.findComponent(TestChild)
            expect(childComponent.vm.dir).toBe('rtl')
        })

        it('应该使用默认的ltr方向', () => {
            const TestChild = defineComponent({
                setup() {
                    const dir = useTextDirection()
                    return { dir }
                },
                template: '<div>{{ dir }}</div>'
            })

            const wrapper = mount(TextDirectionProvider, {
                // 不提供dir prop，应该使用默认值
                slots: {
                    default: TestChild
                }
            })

            // 验证子组件能够获取到默认的文本方向
            const childComponent = wrapper.findComponent(TestChild)
            expect(childComponent.vm.dir).toBe('ltr')
        })

        it('应该在dir变化时更新提供的值', async () => {
            const TestChild = defineComponent({
                setup() {
                    const dir = useTextDirection()
                    return { dir }
                },
                template: '<div>{{ dir }}</div>'
            })

            const wrapper = mount(TextDirectionProvider, {
                props: {
                    dir: 'ltr' as TextDirection
                },
                slots: {
                    default: TestChild
                }
            })

            // 初始值应该是ltr
            const childComponent = wrapper.findComponent(TestChild)
            expect(childComponent.vm.dir).toBe('ltr')

            // 更新dir prop
            await wrapper.setProps({ dir: 'rtl' as TextDirection })

            // 验证子组件获取到了更新的文本方向
            expect(childComponent.vm.dir).toBe('rtl')
        })
    })

    describe('useTextDirection', () => {
        it('在没有Provider的情况下应该返回默认的ltr方向', () => {
            const TestComponent = defineComponent({
                setup() {
                    const dir = useTextDirection()
                    return { dir }
                },
                template: '<div>{{ dir }}</div>'
            })

            const wrapper = mount(TestComponent)

            // 验证返回了默认的文本方向
            expect(wrapper.vm.dir).toBe('ltr')
        })

        it('在有Provider的情况下应该返回提供的文本方向', () => {
            const TestChild = defineComponent({
                setup() {
                    const dir = useTextDirection()
                    return { dir }
                },
                template: '<div>{{ dir }}</div>'
            })

            const wrapper = mount(TextDirectionProvider, {
                props: {
                    dir: 'rtl' as TextDirection
                },
                slots: {
                    default: TestChild
                }
            })

            // 验证子组件能够获取到提供的文本方向
            const childComponent = wrapper.findComponent(TestChild)
            expect(childComponent.vm.dir).toBe('rtl')
        })
    })

    describe('TextDirectionContextKey', () => {
        it('应该是一个唯一的Symbol', () => {
            expect(typeof TextDirectionContextKey).toBe('symbol')
            expect(TextDirectionContextKey.description).toBe('TextDirection')
        })
    })
})