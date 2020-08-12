import { IBoardProperties, Base, IBoardOptions } from "./interfaces";
import Rect from "./rect";
import Point from "./point";
import Container from "./container";
import FlowchartComp from "./flowchartComp";
import EC from "./ec";
export default class Board extends Base {
    protected __s: IBoardProperties;
    get version(): string;
    get name(): string;
    set name(value: string);
    get description(): string | undefined;
    set description(value: string | undefined);
    get filePath(): string | undefined;
    get viewBox(): Rect;
    static defaultZoom: number;
    get zoom(): number;
    set zoom(value: number);
    center(): Point;
    get containers(): Container<EC | FlowchartComp>[];
    get modified(): boolean;
    set modified(value: boolean);
    constructor(options: IBoardOptions);
    add(container: Container<EC | FlowchartComp>): void;
    get(name: string): Container<EC | FlowchartComp> | undefined;
    libraries(library: string): Container<EC | FlowchartComp>[];
    destroy(): void;
    defaults(): IBoardProperties;
}
