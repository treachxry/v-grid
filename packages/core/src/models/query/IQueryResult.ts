import {IQueryRequest} from "@/models/query/IQueryRequest";

export interface IQueryResult<T> {
    data: T[]
    total: number
    request: IQueryRequest
}