<script setup lang="ts" generic="TModel extends IModelBase">
    import {computed, Ref, ref, watch} from "vue";
    import {IGridConfiguration, IQueryRequest, SortDirection} from "@v-grid/core";
    import {useQuery} from "@/composables/useQuery";
    import {IModelBase} from "@/models/IModelBase";
    import {IRowModel} from "@/models/IRowModel";
    import {IGridEvents} from "@/models/IGridEvents";
    import PageView from "@/components/grid/PageView.vue";
    import GridRow from "@/components/grid/GridRow.vue";

    const {config, events, request} = defineProps<{
        config: IGridConfiguration
        events: IGridEvents<TModel>
        request?: IQueryRequest
    }>();

    const queryRequest = ref<IQueryRequest>(request ?? {
        page: 1,
        pageSize: 50,
        sorts: [],
        filters: []
    });

    const {queryResult, refreshQueryResult, updateFilter, updateSort} = useQuery(queryRequest, events.read);
    const models = ref<IRowModel<TModel>[]>([]) as Ref<IRowModel<TModel>[]>;
    const newModel = ref<IRowModel<TModel> | undefined>();

    const columnCount = computed<number>(() => config.columns.filter(x => x.isVisible).length);
    const columnWidth = computed<string>(() => `calc(100% / ${columnCount.value})`)

    watch(queryResult, (result) => {
        models.value = result.data.map(m => ({dirtyFields: [], value: {...m}}));
    });

    const displayModels = computed<IRowModel<TModel>[]>(() => {
        const result: IRowModel<TModel>[] = [...models.value];

        if(newModel.value) {
            result.unshift(newModel.value);
        }

        return result;
    });

    function startCreate() {
        if(newModel.value) {
            return;
        }

        newModel.value = {
            value: {id: 0} as TModel,
            dirtyFields: ['id']
        };
    }

    async function saveChanges() {
        await confirmCreate();

        if(!events.update) {
            return;
        }

        const dirtyModels: TModel[] = models.value.filter(m => m.dirtyFields.length).map(m => m.value);

        await events.update(dirtyModels);
        await refreshQueryResult();
    }

    async function discardChanges() {
        await refreshQueryResult();
    }

    async function confirmCreate() {
        if(newModel.value && events.create) {
            await events.create(newModel.value.value);
        }

        newModel.value = undefined;
    }
</script>

<template>
    <div class="v-grid">
        <!-- header -->
        <div class="v-grid-top-bar" v-if="events.update || events.create">
            <button class="v-grid-button" v-if="events.create" @click="startCreate">Create new</button>
            <button class="v-grid-button" v-if="events.update" @click="saveChanges">Save changes</button>
            <button class="v-grid-button" @click="discardChanges">Discard changes</button>
        </div>

        <!-- grid -->
        <div class="v-grid-table-wrapper">
            <table class="v-grid-table">
                <colgroup>
                    <col/>
                    <col v-for="column in config.columns" v-show="column.isVisible" :style="{width: columnWidth}"/>
                </colgroup>

                <thead>
                    <tr class="v-grid-header-row">
                        <th class="v-grid-header-cell">Actions</th>
                        <th
                            v-for="column in config.columns"
                            v-show="column.isVisible"
                            class="v-grid-header-cell"
                        >
                            <div @click="updateSort(column.key)" class="v-grid-header-title">
                                <span>{{column.title}}</span>
                                <span class="v-grid-sort-icon" v-if="queryRequest.sorts.find(s => s.name === column.key)">
                                    {{queryRequest.sorts.find(s => s.name === column.key)?.direction === SortDirection.Ascending ? '↑' : '↓'}}
                                </span>
                            </div>
                            <input type="text" class="v-filter-input" @input="e => updateFilter(column.key, (e.target as HTMLInputElement).value)"/>
                        </th>
                    </tr>
                </thead>

                <tbody v-if="displayModels.length">
                    <grid-row
                        v-for="(model, i) in displayModels"
                        :model="model"
                        :config="config"
                        :events="events"
                        :creating="i === 0 && newModel !== undefined"
                    />
                </tbody>
                <tbody v-else>
                    <tr>
                        <td :colspan="columnCount + 1">
                            <div class="v-grid-empty">No items</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- footer -->
        <page-view
            v-model="queryRequest"
            :query-result="queryResult"
            :button-limit="7"
            :page-sizes="[5, 10, 20, 50, 100]"
        />
    </div>
</template>