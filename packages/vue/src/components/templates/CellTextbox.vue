<script setup lang="ts">
    import {ref} from "vue";

    const {value, setValue, editable} = defineProps<{
        value: string | undefined
        setValue: (value: string | undefined) => any
        editable: boolean
    }>();

    const open = ref<boolean>(false);
    const currentValue = ref<string | undefined>(value);

    function toggleOpen() {
        if(open.value && setValue) {
            setValue(currentValue.value);
        }

        open.value = !open.value;
    }
</script>

<template>
    <div :class="{'v-grid-active': open}">
        <button class="v-input-action" @click="toggleOpen" >
            {{ editable ? 'edit' : 'view' }}
        </button>
        <div v-if="open" class="v-input-container">
            <textarea :disabled="!editable" v-model="currentValue" class="v-input"/>
            <span class="v-character-count">{{currentValue?.length ?? 0}} characters</span>
        </div>
    </div>
</template>

<style scoped>
    .v-input-action {
        text-align: left;
        text-decoration: transparent underline;
        outline: transparent;
        transition: 150ms all ease-in;
        width: 100%;
    }

    .v-input-action:hover {
        opacity: 0.8;
        text-decoration: currentColor underline;
    }

    .v-input-action:focus-visible {
        opacity: 0.8;
    }

    .v-input-container {
        position: absolute;
        z-index: 10;
        inset: 100% 0 auto 0;
        display: flex;
        flex-direction: column;
    }

    .v-input {
        width: 100%;
        min-height: 15rem;
        max-height: 100dvh;
        padding: 1rem;
        background: var(--color-base);
        color: var(--color-base-content);
        border: 1px solid var(--color-highlight);
        outline: none;
    }

    .v-character-count {
        margin-left: auto;
        background: var(--color-highlight);
        color: var(--color-highlight-content);
        padding: 0 0.5rem;
    }
</style>