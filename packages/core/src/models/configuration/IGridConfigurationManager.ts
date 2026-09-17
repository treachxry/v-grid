import {IGridConfiguration} from "@/models/configuration/IGridConfiguration";
import {IGridBuilder} from "@/models/configuration/IGridBuilder";

export interface IGridConfigurationManager {
    addGrid<TModel extends object>(name: string, init: (builder: IGridBuilder<TModel>) => void): void
    getGrid<TModel extends object>(name: string): IGridConfiguration<TModel> | undefined
}