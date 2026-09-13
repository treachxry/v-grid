import {IGridConfigurationManager} from "@/models/IGridConfigurationManager";
import {IGridConfiguration} from "@/models/IGridConfiguration";
import {IGridBuilder} from "@/models/IGridBuilder";
import {createGrid} from "@/functions/CreateGrid";

export class GridConfigurationManager implements IGridConfigurationManager {
    private grids: Map<string, IGridConfiguration<any>>;

    constructor() {
        this.grids = new Map<string, IGridConfiguration<any>>();
    }

    addGrid<TModel extends object>(name: string, init: (builder: IGridBuilder<TModel>) => void): void {
        const config: IGridConfiguration<TModel> = createGrid(name, init);
        this.grids.set(name, config);
    }

    getGrid<TModel extends object>(name: string): IGridConfiguration<TModel> | undefined {
        return this.grids.get(name);
    }
}