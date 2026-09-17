<script setup lang="ts">
    import {ref} from "vue";

    const {value, setValue, editable} = defineProps<{
        value: boolean | undefined
        setValue: (value: boolean | undefined) => any
        editable: boolean
    }>();

    const open = ref<boolean>(false);
    const currentValue = ref<boolean | undefined>(value);

    function toggleOpen() {
        if(!editable) {
            return;
        }

        if(open.value && setValue) {
            setValue(currentValue.value);
        }

        open.value = !open.value;
    }

    function selectValue(value: boolean) {
        currentValue.value = value;

        toggleOpen();
    }
</script>

<template>
    <div :class="{'v-grid-active': open}" class="v-cell">
        <button class="v-display" @click="toggleOpen">
            {{ currentValue ? 'True' : 'False' }}
        </button>
        <div v-if="open" class="v-input">
            <button @click="selectValue(true)" class="v-button">True</button>
            <button @click="selectValue(false)" class="v-button">False</button>
        </div>
    </div>
</template>

<style scoped>
    .v-cell {
        position: relative;
    }

    .v-display {
        text-align: left;
        width: 100%;
    }

    .v-input {
        position: absolute;
        z-index: 10;
        inset: 100% -0.5rem auto -0.5rem;
        margin-top: 0.375rem;
        display: flex;
        flex-direction: column;
        background: var(--color-base);
    }

    .v-button {
        border-radius: 0;
    }
</style>