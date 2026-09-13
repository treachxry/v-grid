import {IModelBase} from "@/models/IModelBase";

export interface IGridEvents<TModel extends IModelBase> {
    create?(model: TModel): Promise<void>
    update?(models: TModel[]): Promise<void>
    remove?(model: TModel): Promise<void>
    cancel?(model: TModel): Promise<void>
    change?(model: TModel): Promise<void>
}