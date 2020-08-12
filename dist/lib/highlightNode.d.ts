import { Type, IHighlighNodeDefaults } from "./interfaces";
import Point from "./point";
import ItemBase from "./itemsBase";
export default class HighlightNode extends ItemBase {
    protected __s: IHighlighNodeDefaults;
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
