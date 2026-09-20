import {IGridConfigurationManager} from "@/models/configuration/IGridConfigurationManager";
import {IGridConfiguration} from "@/models/configuration/IGridConfiguration";
import {IGridBuilder} from "@/models/configuration/IGridBuilder";
import {GridBuilder} from "@/implementations/GridBuilder";

export class GridConfigurationManager implements IGridConfigurationManager {
    private grids: Map<string, IGridConfiguration>;

    constructor() {
        this.grids = new Map<string, IGridConfiguration>();
    }

    addGrid<TModel extends object>(name: string, init: (builder: IGridBuilder<TModel>) => void): void {
        const config: IGridConfiguration = this.createGrid<TModel>(name, init);

        this.grids.set(name, config);
    }

    createGrid<TModel extends object>(name: string, init: (builder: IGridBuilder<TModel>) => void): IGridConfiguration {
        const config: IGridConfiguration = {
            name: name,
            columns: []
        }

        const builder: IGridBuilder<TModel> = new GridBuilder<TModel>(config)

        init(builder);

        return config;
    }

    getGrid(name: string): IGridConfiguration | undefined {
        return this.grids.get(name);
    }
}