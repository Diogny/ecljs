import ItemBase from "./itemsBase";
import { Type } from "./types";
import { IHighlighNodeSettings } from "./interfaces";
import Point from "./point";
export default class HighlightNode extends ItemBase {
    protected settings: IHighlighNodeSettings;
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
    propertyDefaults(): IHighlighNodeSettings;
}
