import {IGridBuilder} from "@/models/configuration/IGridBuilder";
import {IColumnBuilder} from "@/models/configuration/IColumnBuilder";
import {IColumnConfiguration} from "@/models/configuration/IColumnConfiguration";
import {ColumnBuilder} from "@/implementations/ColumnBuilder";
import {IGridConfiguration} from "@/models/configuration/IGridConfiguration";
import {getPropertyName} from "@/functions/GetPropertyName";

export class GridBuilder<TModel extends object> implements IGridBuilder<TModel> {
    private config: IGridConfiguration;

    constructor(config: IGridConfiguration) {
        this.config = config;
    }

    column<TProp>(getter: (model: TModel) => TProp): IColumnBuilder {
        const key: string = getPropertyName(getter);

        const config: IColumnConfiguration =  {
            key: key,
            title: key,
            isVisible: true,
            isEditable: true
        }

        const builder: IColumnBuilder = new ColumnBuilder(config);

        this.config.columns.push(config);

        return builder;
    }
}