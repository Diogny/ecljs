import Container from "./container";
import FlowchartComp from "./flowchartComp";
import EC from "./ec";
export default class Board {
    protected $: Container<EC | FlowchartComp>[];
    get containers(): Container<EC | FlowchartComp>[];
    constructor(containers?: Container<EC | FlowchartComp>[]);
    add(container: Container<EC | FlowchartComp>): void;
    delete(name: string): Container<EC | FlowchartComp> | undefined;
    get(name: string): Container<EC | FlowchartComp> | undefined;
    libraries(library: string): Container<EC | FlowchartComp>[];
    destroy(): void;
}
