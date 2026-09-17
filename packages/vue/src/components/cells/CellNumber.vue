<script setup lang="ts">
    import {nextTick, ref, useTemplateRef} from "vue";

    const {value, setValue, editable} = defineProps<{
        value: number | undefined
        setValue: (value: number | undefined) => any
        editable: boolean
    }>();

    const open = ref<boolean>(false);
    const currentValue = ref<number | undefined>(value);
    const inputElement = useTemplateRef('input');

    async function openInput() {
        if(open.value || !editable) {
            return;
        }

        open.value = true;

        await nextTick();
        inputElement.value?.focus();
    }

    async function closeInput() {
        if(!open.value) {
            return;
        }

        if(setValue) {
            setValue(currentValue.value);
        }

        open.value = false;
    }
</script>

<template>
    <div :class="{'v-grid-active': open}" class="v-cell">
        <div
            v-if="!open"
            class="v-display"
            v-text="currentValue"
            tabindex="0"
            @focus="openInput"
        />
        <input
            v-else
            ref="input"
            type="number"
            v-model="currentValue"
            class="v-input"
            @blur="closeInput"
        />
    </div>
</template>

<style scoped>
    .v-cell {
        position: relative;
        min-height: 1lh;
    }

    .v-display {
        text-align: left;
        min-height: 1lh;
        text-wrap: nowrap;
        position: absolute;
        inset: 0;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .v-input {
        min-width: 0;
        width: 100%;
        outline: none;
    }
</style>