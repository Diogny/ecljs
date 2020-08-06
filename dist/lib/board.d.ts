import { IBoardProperties, BaseSettings, IBoardOptions } from "./interfaces";
import Rect from "./rect";
import Point from "./point";
import Container from "./container";
import FlowchartComponent from "./flowchartComponent";
import EC from "./ec";
export default class Board extends BaseSettings {
    protected settings: IBoardProperties;
    get version(): string;
    get name(): string;
    get description(): string;
    get filePath(): string;
    get viewBox(): Rect;
    get containers(): Container<EC | FlowchartComponent>[];
    static defaultZoom: number;
    get zoom(): number;
    set zoom(value: number);
    get modified(): boolean;
    constructor(options: IBoardOptions);
    add(container: Container<EC | FlowchartComponent>): void;
    center(): Point;
    get(library: string): Container<EC | FlowchartComponent> | undefined;
    clear(options: IBoardOptions): void;
    propertyDefaults(): IBoardProperties;
    static get zoomMultipliers(): number[];
    static get zoomFactors(): string[];
    static validZoom(zoom: number): boolean;
}
