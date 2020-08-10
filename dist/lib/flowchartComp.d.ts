import { Type, IItemSolidOptions, IPoint, IItemBoardProperties } from "./interfaces";
import Size from "./size";
import ItemSolid from "./itemSolid";
import Container from "./container";
export default abstract class FlowchartComp extends ItemSolid {
    get type(): Type;
    get size(): Size;
    set size(value: Size);
    abstract onResize(size: Size): void;
    get inputs(): number;
    get outputs(): number;
    constructor(container: Container<FlowchartComp>, options: IItemSolidOptions);
    setNode(node: number, p: IPoint): FlowchartComp;
    defaults(): IItemBoardProperties;
}
