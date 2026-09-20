<script setup lang="ts">
    import {ref} from "vue";
    import GridTable from "../../src/components/grid/GridTable.vue";
    import {createGrid} from "@v-grid/core/dist/functions/CreateGrid";
    import {IQueryRequest, IQueryResult} from "@v-grid/core";
    import {IGridEvents} from "@/models/IGridEvents";

    interface TestModel {
        id: number
        name: string
    }

    const config = createGrid<TestModel>('Test', grid => {
       grid.column(m => m.name).title('Name');
    });

    const data = ref<TestModel[]>(createData());

    const request: IQueryRequest = {
        page: 1,
        pageSize: 10,
        sorts: [],
        filters: []
    };

    const events: IGridEvents<TestModel> = {
        remove(model: TestModel): Promise<void> {
            const index = data.value.findIndex(m => m.id === model.id);

            console.log(index)

            if(index >= 0) {
                data.value = data.value.toSpliced(index, 1);
            }
        },
        create(model: TestModel): Promise<void> {

        },
        update(models: TestModel[]): Promise<void> {

        },
    };

    function createData() {
        const data = [];

        for(let i = 1; i <= 95; i++) {
            data.push({
                id: i,
                name: 'Example ' + i
            })
        }

        return data;
    }

    async function readData(request: IQueryRequest): Promise<IQueryResult<TestModel>> {
        const startIndex = (request.page - 1) * request.pageSize;
        const endIndex = Math.min(data.value.length, startIndex + request.pageSize);

        return {
            total: data.value.length,
            request: request,
            data: data.value.slice(startIndex, endIndex)
        };
    }
</script>

<template>
    <div style="position: absolute; inset: 1rem; overflow-y: auto">
        <grid-table
            :config="config"
            :read-data="readData"
            :request="request"
            :events="events"
        />
    </div>
</template>