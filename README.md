# griffel-vue

基于 [@griffel/react](https://github.com/microsoft/griffel) 的 Vue3 版本，提供高性能的 CSS-in-JS 解决方案，支持响应式样式和 SSR。

## 特性

- 完全兼容 Vue3 组件体系
- 支持 SSR 服务端渲染
- 提供类似 React 的 API（如 Provider、useRenderer、useInsertionEffect 等）
- 按需插入样式，自动去重

## 安装

```bash
npm install griffel-vue
```

## 快速上手

```vue
// App.vue
<script setup lang="ts">
import { useRenderer_unstable } from 'griffel-vue';
import { HelloWorld } from './HelloWorld';
// 导入渲染器，这一步是必须的
useRenderer_unstable()
</script>

<template>
  <div>
    <HelloWorld />
  </div>
</template>

//HelloWorld.vue

<template>
    <div>
        <button :class="classes.button">test </button>
        <span :class="classes.icon">textt</span>
    </div>
</template>

<script setup lang="ts">
import { useClasses } from './css';
const classes = useClasses();
</script>

// css.tsx
import { makeStyles } from 'griffel-vue';

export const useClasses = makeStyles({
    button: { color: 'red' },
    icon: { paddingLeft: '5px' },
});
```

## 开发

- 安装依赖

  ```bash
  npm install
  ```

- 运行 playground

  ```bash
  npm run playground
  ```

- 单元测试

  ```bash
  npm run test
  ```

- 构建库

  ```bash
  npm run build
  ```

## 相关链接

- [@griffel/react 官方文档](https://github.com/microsoft/griffel)
- [Vue3 官方文档](https://v3.vuejs.org/)

## License

MIT
