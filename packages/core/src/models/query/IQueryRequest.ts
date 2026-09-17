import {IFilter} from "@/models/query/IFilter";
import {ISort} from "@/models/query/ISort";

export interface IQueryRequest {
    page: number
    pageSize: number
    filters: IFilter[]
    sorts: ISort[]
}

