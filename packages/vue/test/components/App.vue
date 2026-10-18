<script setup lang="ts">
    import {ref} from "vue";
    import GridTable from "@/components/grid/GridTable.vue";
    import {IQueryRequest, GridConfigurationManager} from "@v-grid/core";
    import {IGridEvents} from "@/models/IGridEvents";

    interface TestModel {
        id: number
        name: string
    }

    const manager = new GridConfigurationManager();

    const config = manager.createGrid<TestModel>('Test', grid => {
        grid.column(m => m.id).editable(false);
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
        read(request: IQueryRequest) {
            const startIndex = (request.page - 1) * request.pageSize;
            const endIndex = Math.min(data.value.length, startIndex + request.pageSize);

            return {
                total: data.value.length,
                request: request,
                data: data.value.slice(startIndex, endIndex)
            };
        },
        remove(model: TestModel) {
            const index = data.value.findIndex(m => m.id === model.id);

            console.log(index)

            if(index >= 0) {
                data.value = data.value.toSpliced(index, 1);
            }
        },
        create(model: TestModel) {

        },
        update(models: TestModel[]) {

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
</script>

<template>
    <div>
        <div>
            <div></div>
        </div>
        <div class="container">
            <grid-table
                :config="config"
                :events="events"
                :request="request"
            />
        </div>
    </div>
</template>

<style scoped>
    .container {
        position: absolute;
        inset: 1rem;
        overflow-y: auto;
    }
</style>