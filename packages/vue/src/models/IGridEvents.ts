import {IModelBase} from "@/models/IModelBase";
import {IQueryRequest, IQueryResult} from "@v-grid/core";

export interface IGridEvents<TModel extends IModelBase> {
    read(request: IQueryRequest): Promise<IQueryResult<TModel>> | IQueryResult<TModel>
    create?(model: TModel): Promise<void> | void
    update?(models: TModel[]): Promise<void> | void
    remove?(model: TModel): Promise<void> | void
    cancel?(model: TModel): Promise<void> | void
    change?(model: TModel): Promise<void> | void
}