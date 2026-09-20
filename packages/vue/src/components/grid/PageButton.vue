<script setup lang="ts">
    defineProps<{
        label: number | string
        active: boolean
    }>();
</script>

<template>
    <button class="v-page-button" :class="{'v-active': active}">
        <span>{{label}}</span>
    </button>
</template>