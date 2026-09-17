import {FilterType} from "@/models/enum/FilterType";

export interface IFilter {
    name: string
    value: unknown
    type: FilterType
}