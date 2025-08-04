import { Point } from "dabbjs/dist/lib/point";
import { Type, IHighlighNodeDefaults } from "./interfaces";
import { ItemBase } from "./itemsBase";
export declare class HighlightNode extends ItemBase {
    protected $: IHighlighNodeDefaults;
    get type(): Type;
    get radius(): number;
    get selectedId(): string;
    get selectedNode(): number;
    constructor(options: {
        [x: string]: any;
    });
    setRadius(value: number): HighlightNode;
    hide(): HighlightNode;
    show(x: number, y: number, id: string, node: number): HighlightNode;
    showConnections(nodes: Point[]): HighlightNode;
    defaults(): IHighlighNodeDefaults;
}
