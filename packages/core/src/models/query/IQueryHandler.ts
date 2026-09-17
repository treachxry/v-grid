import {IQueryRequest} from "@/models/query/IQueryRequest";
import {ISort} from "@/models/query/ISort";
import {SortDirection} from "@/models/enum/SortDirection";
import {IFilter} from "@/models/query/IFilter";
import {FilterType} from "@/models/enum/FilterType";

export interface IQueryHandler {
    updateSort(name: string): void

    updateFilter(name: string, value: unknown): void

    getRequest(): IQueryRequest
}

export class QueryHandler implements IQueryHandler {
    private readonly request: IQueryRequest;

    constructor() {
        this.request = {
            page: 1,
            pageSize: 50,
            filters: [],
            sorts: []
        };
    }

    getRequest(): IQueryRequest {
        return this.request;
    }

    updateFilter(name: string, value: unknown): void {
        const filters: IFilter[] = this.request.filters;
        const index: number = filters.findIndex(m => m.name === name);
        const filter: IFilter | null = index < 0 ? null : filters[index];

        if (value === undefined || value === null) {
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

    updateSort(name: string): void {
        const sorts: ISort[] = this.request.sorts;
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

}