<script setup lang="ts">
    import {computed} from "vue";
    import {usePagination} from "@/composables/usePagination";
    import {IQueryRequest, IQueryResult} from "@v-grid/core";
    import PageButton from "@/components/grid/PageButton.vue";

    const queryRequest = defineModel<IQueryRequest>({required: true});

    const {queryResult, buttonLimit = 10, pageSizes} = defineProps<{
        queryResult: IQueryResult<unknown>
        buttonLimit?: number
        pageSizes: number[]
    }>();

    const {getPagesFromQuery, isPlaceholderValue} = usePagination(buttonLimit);

    const pageNumbers = computed<number[]>(() => getPagesFromQuery(queryResult));
    const totalPages = computed(() => queryResult.total);
    const startIndex = computed(() => (queryRequest.value.page - 1) * queryRequest.value.pageSize + 1);
    const endIndex = computed(() => Math.min(totalPages.value, queryRequest.value.page * queryRequest.value.pageSize));

    function goToPage(i: number) {
        queryRequest.value.page = i;
    }

    function onPageSizeChange() {
        queryRequest.value.page = 1;
    }
</script>

<template>
    <div class="v-pagination">
        <!-- page number -->
        <div class="v-button-container">
            <div v-for="i in pageNumbers">
                <span v-if="isPlaceholderValue(i)" class="v-page-placeholder">
                    ...
                </span>
                <page-button
                    v-else
                    @click="goToPage(i)"
                    :label="i"
                    :active="i === queryRequest.page"
                    class="v-page-button"
                />
            </div>
        </div>

        <!-- page size -->
        <select v-model="queryRequest.pageSize" @change="onPageSizeChange" class="v-dropdown">
            <option v-for="i in pageSizes" :value="i">{{i}}</option>
        </select>

        <!-- item number -->
        <div class="v-grid-item-count">{{startIndex}}-{{endIndex}} of {{totalPages}} items</div>
    </div>
</template>