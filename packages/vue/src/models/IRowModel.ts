import {IModelBase} from "@/models/IModelBase";

export interface IRowModel<TModel extends IModelBase> {
    value: TModel
    dirtyFields: string[]
}