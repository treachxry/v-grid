<script setup lang="ts" generic="TModel extends IModelBase, TProp">
    import {computed, isReadonly} from "vue";
    import {Component as ComponentModel} from "@vue/runtime-core";
    import {IColumnConfiguration} from "@v-grid/core";
    import {IRowModel} from "@/models/IRowModel";
    import {IModelBase} from "@/models/IModelBase";
    import CellText from "@/components/templates/CellText.vue";
    import CellTextbox from "@/components/templates/CellTextbox.vue";
    import CellNumber from "@/components/templates/CellNumber.vue";
    import CellBoolean from "@/components/templates/CellBoolean.vue";

    const components: ComponentModel[] = [
        CellText,
        CellTextbox,
        CellNumber,
        CellBoolean
    ];

    const {model, config, editable} = defineProps<{
        model: IRowModel<TModel>
        config: IColumnConfiguration
        editable: boolean
    }>();

    const cellComponent = computed<ComponentModel>(() => {
        if(config.customTemplate) {
            const template = components.find(c => (c as any)['__name'] === config.customTemplate);

            if(template) {
                return template;
            }
        }

        return CellText;
    });

    const cellValue = computed<TProp>(() => {
        const modelValue: TModel = model.value;
        const key: string = config.key;

        return modelValue[key as keyof TModel] as TProp;
    })

    const isReadonly = computed<boolean>(() => {
        return !config.isEditable || !editable;
    });

    const isDirty = computed<boolean>(() => {
        const dirtyFields: string[] = model.dirtyFields;
        const key: string = config.key;

        return dirtyFields.includes(key);
    })

    function setCellValue(newValue: TProp) {
        const key: string = config.key;
        const dirtyFields: string[] = model.dirtyFields;
        const oldValue: TProp = cellValue.value;

        if(oldValue === newValue) {
            const index = dirtyFields.findIndex(f => f === key);

            if(index !== -1) {
                dirtyFields.splice(index, 1);
            }

            return;
        }

        const modelValue: TModel = model.value;

        modelValue[key as keyof TModel] = newValue as any;

        if(!dirtyFields.includes(key)) {
            dirtyFields.push(key);
        }
    }
</script>

<template>
    <td
        v-show="config.isVisible"
        class="v-grid-cell"
        :class="{'v-grid-readonly': isReadonly, 'v-grid-dirty': isDirty}"
    >
        <component
            :is="cellComponent"
            :value="cellValue"
            :set-value="setCellValue"
            :editable="!isReadonly"
        />
    </td>
</template>