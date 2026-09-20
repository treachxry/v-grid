export interface IColumnBuilder {
    title(name: string): IColumnBuilder
    visible(visible: boolean): IColumnBuilder
    editable(editable: boolean): IColumnBuilder
    template(name: string | undefined): IColumnBuilder
}