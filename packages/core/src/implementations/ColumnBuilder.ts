import {IColumnBuilder} from "@/models/configuration/IColumnBuilder";
import {IColumnConfiguration} from "@/models/configuration/IColumnConfiguration";

export class ColumnBuilder implements IColumnBuilder {
    private column: IColumnConfiguration;

    constructor(column: IColumnConfiguration) {
        this.column = column;
    }

    title(name: string) {
        this.column.title = name;

        return this;
    }

    visible(visible: boolean) {
        this.column.isVisible = visible;

        return this;
    }

    editable(editable: boolean) {
        this.column.isEditable = editable;

        return this;
    }

    template(name: string | undefined) {
        this.column.customTemplate = name;

        return this;
    }
}