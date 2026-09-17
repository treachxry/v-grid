import {createColumn} from "@/functions/CreateColumn";
import {IGridConfiguration} from "@/models/configuration/IGridConfiguration";
import {IGridColumnConfiguration} from "@/models/configuration/IGridColumnConfiguration";
import {IGridBuilder} from "@/models/configuration/IGridBuilder";
import {IGridColumnBuilder} from "@/models/configuration/IGridColumnBuilder";

export function createGrid<TModel extends object>(name: string, init: (builder: IGridBuilder<TModel>) => void): IGridConfiguration<TModel> {
    const columns: IGridColumnConfiguration<TModel, any>[] = [];

    const builder: IGridBuilder<TModel> = {
        column
    };

    init(builder);

    function column<TProp>(getter: (model: TModel) => TProp): IGridColumnBuilder<TModel> {
        const {column, builder} = createColumn<TModel, TProp>(getter);

        columns.push(column);

        return builder;
    }

    return {
        name,
        columns
    };
}