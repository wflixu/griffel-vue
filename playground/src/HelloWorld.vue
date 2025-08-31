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

<style scoped></style>