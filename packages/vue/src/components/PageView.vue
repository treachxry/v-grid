<script setup lang="ts">
    import {computed} from "vue";
    import {usePagination} from "@/composables/usePagination";
    import PageButton from "@/components/PageButton.vue";

    const currentPage = defineModel<number>('currentPage', {required: true});
    const pageSize = defineModel<number>('pageSize',{required: true});

    const {total, buttonLimit = 10} = defineProps<{
        total: number
        buttonLimit?: number
    }>();

    const {getPages, isPlaceholderValue} = usePagination(buttonLimit);
    const pages = computed<number[]>(() => getPages(currentPage.value, pageSize.value, total))

    function goToPage(i: number) {
        currentPage.value = i;
    }

    const start = computed(() => (currentPage.value - 1) * pageSize.value + 1);
    const end = computed(() => Math.min(total, currentPage.value * pageSize.value));
</script>

<template>
    <div class="v-pagination">
        <div class="v-button-container">
            <div v-for="i in pages">
                <span v-if="isPlaceholderValue(i)" class="v-page-button">
                    ...
                </span>
                <page-button
                    v-else
                    @click="goToPage(i)"
                    :label="i"
                    :active="i === currentPage"
                    class="v-page-button"
                />
            </div>
        </div>

        <!-- item number -->
        <div class="v-grid-item-count">{{start}}-{{end}} of {{total}} items</div>
    </div>
</template>

<style scoped>
    .v-button-container {
        display: flex;
        align-items: center;
        gap: 0.375rem;
    }
</style>