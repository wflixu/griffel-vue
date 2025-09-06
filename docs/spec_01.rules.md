背景：@griffel/react 是 一套开源的css in js，但是只能在react 中使用，现在这个代码库就是翻译 @griffel/react 代码库中的代码，来适配vue3。

这个文件如果适配vue3 应该怎么修改


假如你是一个web 前端的数据专家，精通vue3 ts react，nodejs ，前端构建工具等，我现在正在把 @griffel/react 这个 react 生态的 css in js 方案迁移到 vue3 生态，做了一个 griffel-vue 的npm 包，代码基本上写完了，现在有2个大的任务和若干个小的任务，请帮我完成，第一个大的任务是 把之前@griffel/react 中的单元测试（jest react生态）迁移到 vue3 vitest @vue/test-utils 生态。第二本任务是配置 这个库的构建配置，github action 配置，npm 发包配置，readme文档。

以上是背景，我们一步一步来，我们开始第一个大任务 单元测试，我一会给你代码，你帮我完成单元测试代码，单元测试 的运行环境是vitest，用ts 或tsx 写，这个库的目标是vue3 。

我的目录结构是这样的，源码在src 目录下，单元测试在 tests 目录下，这个补充背景，记住不需要 以后的单元测试用例，文件应用用上 ```├── src
│   ├── __css.ts
│   ├── __resetCSS.ts
│   ├── __resetStyles.ts
│   ├── __styles.ts
│   ├── index.ts
│   ├── insertionFactory.ts
│   ├── makeResetStyles.ts
│   ├── makeStaticStyles.ts
│   ├── makeStyles.ts
│   ├── RendererContext.tsx
│   ├── renderToStyleElements.ts
│   ├── TextDirectionContext.tsx
│   ├── useInsertionEffect.ts
│   └── utils.ts
├── tests
│   ├── createDOMRenderer.test.tsx
│   ├── insertionFactory.test.ts
│   ├── makeResetStyles.test.tsx
│   ├── makeStyles.test.tsx
│   ├── RendererContext.test.tsx
│   ├── renderToStyleElements.test.tsx
│   ├── useInsertionEffect.test.ts
│   └── utils.test.ts
├── tsconfig.json
├── tsdown.config.ts
├── vite.config.ts
└── vitest.config.ts```



这个文件的测试用例通过了，继续下一个文件RendererContext.tsx , 这是代码：```  ```, 请帮我编写测试用例

实际 运行，还有一个错误，提示如下：```
⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯

 FAIL  tests/RendererContext.test.tsx > RendererContext > useRenderer > 在有Provider的情况下应该返回提供的渲染器
AssertionError: expected "spy" to not be called at all, but actually been called 1 times

Received: 

  1st spy call:

    Array []


Number of calls: 1

 ❯ tests/RendererContext.test.tsx:205:47
    203| 
    204|             // 验证createDOMRenderer没有被调用（因为使用了提供的渲染器）
    205|             expect(mockCreateDOMRenderer).not.toHaveBeenCalled()
       |                                               ^
    206|         })
    207|     })```, 请修改，只输出变化的代码，不用全部输出



    我采用  `// 修改这一行：因为默认参数总是会计算，所以createDOMRenderer被调用了一次
  expect(mockCreateDOMRenderer).toHaveBeenCalledTimes(1) ` 实际运行测试，全部通过了，我们继续下一个文件的测试用例编写

实际运行后，这个测试文件全部通过了，下一个文件，我们继续 renderToStyleElements.test.ts 文件 单元测试用的编写，它的代码如下：```  ```, 请帮我写单元测试用例


你写的太多太笼统了，我们一步一步来，现在把这大的任务分为几个小任务：
1. pr 到github main分支上出发 测试和构建
2. 创建release 的时候，发布npm包
3. 优化readme 文件，在npm 中能更好的显示，
目前开始做 1 出发单元测试， 配置 unit-test.yaml 文件 是这样的：``` ```，这歌配置可能不对，请检查优化这个文件

这是另一个 release.yaml配置文件，是发布npm 包用的，我想改变出触发条件，但创建