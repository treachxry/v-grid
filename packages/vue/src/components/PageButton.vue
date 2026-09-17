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

<style scoped>
    .v-page-button {
        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid var(--color-highlight);
        border-radius: 0.25rem;
        transition-duration: 150ms;
        transition-property: color, background-color;
        transition-timing-function: ease-in;
    }

    .v-page-button:not(.v-active):hover {
        background: color-mix(in oklch, var(--color-highlight) 20%, transparent);
    }

    .v-page-button.v-active {
        background: var(--color-highlight);
        color: var(--color-highlight-content);
    }

    .v-page-button > span {
        padding-left: 1px;
    }
</style>