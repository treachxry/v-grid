import {IColumnConfiguration} from "@/models/configuration/IColumnConfiguration";

export interface IGridConfiguration {
    name: string
    columns: IColumnConfiguration[]
}