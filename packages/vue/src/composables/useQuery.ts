import {ref, Ref, watch} from "vue";
import {FilterType, IFilter, IQueryRequest, IQueryResult, ISort, SortDirection} from "@v-grid/core";

export function useQuery<TModel>(queryRequest: Ref<IQueryRequest>, readAction: (request: IQueryRequest) => Promise<IQueryResult<TModel>> | IQueryResult<TModel>) {
    const queryResult: Ref<IQueryResult<TModel>> = ref<IQueryResult<TModel>>({data: [], total: 0, request: queryRequest.value}) as Ref<IQueryResult<TModel>>;
    const isLoading: Ref<boolean> = ref<boolean>(true);
    const isInitialized = ref<boolean>(false);

    watch(queryRequest, refreshQueryResult, {immediate: true, deep: true});

    function updateFilter(name: string, value: unknown): void {
        const filters: IFilter[] = queryRequest.value.filters;
        const index: number = filters.findIndex(m => m.name === name);
        const filter: IFilter | null = index < 0 ? null : filters[index];

        if(value === undefined || value === null) {
            if(filter) {
                filters.splice(index, 1);
            }
        }
        else if(filter === null) {
            filters.push({name: name, value: value, type: FilterType.Equal});
        }
        else {
            filter.value = value;
        }
    }

    function updateSort(name: string): void {
        const sorts: ISort[] = queryRequest.value.sorts;
        const index: number = sorts.findIndex(m => m.name === name);
        const sort: ISort | null = index < 0 ? null : sorts[index];

        if(sort === null) {
            sorts.push({name: name, direction: SortDirection.Ascending});
        }
        else if(sort.direction === SortDirection.Ascending) {
            sort.direction = SortDirection.Descending;
        }
        else {
            sorts.splice(index, 1);
        }
    }

    async function refreshQueryResult(): Promise<void> {
        isLoading.value = true;

        queryResult.value = await readAction(queryRequest.value);

        isLoading.value = false;
        isInitialized.value = true;
    }

    return {
        queryResult,
        isLoading,
        isInitialized,
        updateFilter,
        updateSort,
        refreshQueryResult
    }
}