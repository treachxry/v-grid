<script setup lang="ts" generic="TModel extends IModelBase">
    import {Component as ComponentModel, computed, Ref, ref, watch} from "vue";
    import {IGridColumnConfiguration, IGridConfiguration} from "@v-grid/core";
    import {IModelBase} from "@/models/IModelBase";
    import {IRowModel} from "@/models/IRowModel";
    import {IGridEvents} from "@/models/IGridEvents";
    import Check from "@/components/icons/Check.vue";
    import Ban from "@/components/icons/Ban.vue";
    import X from "@/components/icons/X.vue";
    import CellText from "@/components/cells/CellText.vue";
    import CellTextbox from "@/components/cells/CellTextbox.vue";
    import CellNumber from "@/components/cells/CellNumber.vue";
    import CellBoolean from "@/components/cells/CellBoolean.vue";
    import PageView from "@/components/PageView.vue";

    const {data, config, events = {} as IGridEvents<TModel>} = defineProps<{
        data: TModel[]
        config: IGridConfiguration<TModel>
        events?: IGridEvents<TModel>
    }>();

    const models = ref<IRowModel<TModel>[]>(getFreshData()) as Ref<IRowModel<TModel>[]>;
    const newModel = ref<IRowModel<TModel> | undefined>();

    const pageSize = ref(50);
    const currentPage = ref(1);

    const components: ComponentModel[] = [
        CellText,
        CellTextbox,
        CellNumber,
        CellBoolean
    ];

    watch(() => data, () => {
        models.value = getFreshData();
    });

    function getFreshData() {
        return data.map(m => ({value: {...m}, dirtyFields: []}));
    }

    function getTemplate(col: IGridColumnConfiguration<TModel, unknown>): ComponentModel {
        if(col.customTemplate) {
            const template = components.find(c => (c as any)['__name'] === col.customTemplate);

            if(template) {
                return template;
            }
        }

        return CellText;
    }

    const columnCount = computed(() => {
        return config.columns.filter(x => x.isVisible).length;
    })

    const columnWidth = computed(() => {
        return `calc(100% / ${columnCount.value})`;
    });

    const displayModels = computed<IRowModel<TModel>[]>(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        const end = Math.min(models.value.length, start + pageSize.value);

        const result: IRowModel<TModel>[] = models.value.slice(start, end)

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
            dirtyFields: []
        };
    }

    async function confirmCreate() {
        if(!newModel.value || !events.create) {
            return;
        }

        await events.create(newModel.value.value);

        newModel.value = undefined;
    }

    async function cancelCreate() {
        if(!newModel.value || !events.cancel) {
            return;
        }

        await events.cancel(newModel.value.value);

        newModel.value = undefined;
    }

    async function deleteRow(model: TModel) {
        if(!events.remove) {
            return;
        }

        await events.remove(model);
    }

    function updateRow<TProp>(model: IRowModel<TModel>, column: IGridColumnConfiguration<TModel, TProp>, value: any) {
        const oldValue: TProp = column.getValue(model.value);
        const newValue: TProp = value;

        if(oldValue === newValue) {
            return;
        }

        column.setValue(model.value, newValue);

        if(!model.dirtyFields.includes(column.key)) {
            model.dirtyFields.push(column.key);
        }
    }

    async function saveChanges() {
        if(!events.update) {
            return;
        }

        const dirtyModels: TModel[] = models.value.filter(m => m.dirtyFields.length).map(m => m.value as TModel);

        await events.update(dirtyModels);
    }

    function discardChanges() {
        models.value = getFreshData();
    }

    function getRowKey(model: IRowModel<TModel>): string {
        return `${model.value.id}/${model.dirtyFields.length}`;
    }
</script>

<template>
    <div class="v-grid">
        <!-- header -->
        <div class="v-grid-top-bar">
            <button class="v-grid-button" v-if="events.create" @click="startCreate">
                Create new
            </button>
            <button class="v-grid-button" v-if="events.update" @click="saveChanges">
                Save changes
            </button>
            <button class="v-grid-button" v-if="events.update" @click="discardChanges">
                Discard changes
            </button>
        </div>

        <!-- grid -->
        <table class="v-grid-table">
            <colgroup>
                <col/>
                <template v-for="col in config.columns">
                    <col v-if="col.isVisible" :style="{width: columnWidth}"/>
                </template>
            </colgroup>
            <thead>
            <tr class="v-grid-header-row">
                <th class="v-grid-header-cell">Actions</th>
                <template v-for="col in config.columns">
                    <th v-if="col.isVisible" class="v-grid-header-cell">
                        {{col.title}}
                    </th>
                </template>
            </tr>
            </thead>
            <tbody v-if="displayModels.length">
            <tr v-for="(model, i) in displayModels" class="v-grid-row" :key="getRowKey(model)">
                <td class="v-grid-cell">
                    <div class="v-grid-actions">
                        <template v-if="i === 0 && newModel">
                            <button class="" @click="confirmCreate">
                                <check class="v-grid-icon"/>
                            </button>
                            <button @click="cancelCreate()">
                                <ban class="v-grid-icon"/>
                            </button>
                        </template>
                        <template v-else>
                            <button v-if="events.remove" @click="deleteRow(model.value)">
                                <x class="v-grid-icon"/>
                            </button>
                        </template>
                    </div>
                </td>
                <template v-for="col in config.columns">
                    <td
                        v-show="col.isVisible"
                        class="v-grid-cell"
                        :class="{'v-grid-readonly': !col.isEditable || !events.update, 'v-grid-dirty': model.dirtyFields.includes(col.key)}"
                    >
                        <component
                            :is="getTemplate(col)"
                            :value="col.getValue(model.value)"
                            :set-value="(v: any) => updateRow(model, col, v)"
                            :editable="col.isEditable && events.update !== undefined"
                        />
                    </td>
                </template>
            </tr>
            </tbody>
            <tbody v-else>
            <tr>
                <td :colspan="columnCount + 1">
                    <div class="v-grid-empty">No items</div>
                </td>
            </tr>
            </tbody>
        </table>

        <!-- footer -->
        <page-view
            :total="data.length"
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
        />
    </div>
</template>