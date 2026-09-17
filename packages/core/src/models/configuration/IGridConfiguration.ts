import {IGridColumnConfiguration} from "@/models/configuration/IGridColumnConfiguration";

export interface IGridConfiguration<TModel extends object> {
    name: string
    columns: IGridColumnConfiguration<TModel, any>[]
}