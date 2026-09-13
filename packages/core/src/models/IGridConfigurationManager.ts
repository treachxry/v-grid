import {IGridConfiguration} from "@/models/IGridConfiguration";
import {IGridBuilder} from "@/models/IGridBuilder";

export interface IGridConfigurationManager {
    addGrid<TModel extends object>(name: string, init: (builder: IGridBuilder<TModel>) => void): void
    getGrid<TModel extends object>(name: string): IGridConfiguration<TModel> | undefined
}