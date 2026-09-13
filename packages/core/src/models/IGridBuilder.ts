import {IGridColumnBuilder} from "@/models/IGridColumnBuilder";

export interface IGridBuilder<TModel extends object> {
    column<TProp>(getter: (model: TModel) => TProp): IGridColumnBuilder<TModel>
}