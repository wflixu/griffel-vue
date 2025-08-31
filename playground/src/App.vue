<script setup lang="ts">
import { useRenderer_unstable } from '../../src';
// import { HelloWorld } from './HelloWorld';
import HelloWorld from './HelloWorld.vue';
// 导入渲染器，这一步是必须的
useRenderer_unstable()
</script>

<template>
  <div>
    <HelloWorld />
  </div>
</template>
