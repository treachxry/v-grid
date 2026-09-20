import {IColumnBuilder} from "@/models/configuration/IColumnBuilder";

export interface IGridBuilder<TModel extends object> {
    column<TProp>(getter: (model: TModel) => TProp): IColumnBuilder
}