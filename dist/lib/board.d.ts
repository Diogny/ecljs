import { IBoardDefaults, Base, IBoardOptions } from "./interfaces";
import Container from "./container";
import FlowchartComp from "./flowchartComp";
import EC from "./ec";
export default class Board extends Base {
    protected __s: IBoardDefaults;
    get containers(): Container<EC | FlowchartComp>[];
    get modified(): boolean;
    set modified(value: boolean);
    constructor(options: IBoardOptions);
    add(container: Container<EC | FlowchartComp>): void;
    delete(name: string): Container<EC | FlowchartComp> | undefined;
    get(name: string): Container<EC | FlowchartComp> | undefined;
    libraries(library: string): Container<EC | FlowchartComp>[];
    destroy(): void;
    defaults(): IBoardDefaults;
}
