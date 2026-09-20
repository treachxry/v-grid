<script setup lang="ts" generic="TModel extends IModelBase">
    import {computed} from "vue";
    import {IGridConfiguration} from "@v-grid/core";
    import {IRowModel} from "@/models/IRowModel";
    import {IGridEvents} from "@/models/IGridEvents";
    import {IModelBase} from "@/models/IModelBase";
    import GridCell from "@/components/grid/GridCell.vue";
    import X from "@/components/icons/X.vue";

    const {model, config, events} = defineProps<{
        model: IRowModel<TModel>
        config: IGridConfiguration
        events: IGridEvents<TModel>
    }>();

    const rowKey = computed(() => {
        return `${model.value.id}/${model.dirtyFields.length}`;
    });

    async function deleteRow() {
        if(!events.remove) {
            return;
        }

        await events.remove(model.value);
    }
</script>

<template>
    <tr class="v-grid-row" :key="rowKey">
        <td class="v-grid-cell">
            <div class="v-grid-actions">
                <button v-if="events.remove" @click="deleteRow">
                    <x class="v-grid-icon"/>
                </button>
            </div>
        </td>

        <grid-cell
            v-for="col in config.columns"
            :model="model"
            :config="col"
            :editable="events.update !== undefined"
        />
    </tr>
</template>