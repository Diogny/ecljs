import { Type, IHighlighNodeSettings } from "./interfaces";
import Point from "./point";
import ItemBase from "./itemsBase";
export default class HighlightNode extends ItemBase {
    protected __s: IHighlighNodeSettings;
    protected mainNode: SVGCircleElement;
    get type(): Type;
    get radius(): number;
    get selectedId(): string;
    get selectedNode(): number;
    constructor(options: IHighlighNodeSettings);
    setRadius(value: number): HighlightNode;
    hide(): HighlightNode;
    show(x: number, y: number, id: string, node: number): HighlightNode;
    showConnections(nodes: Point[]): HighlightNode;
    defaults(): IHighlighNodeSettings;
}
