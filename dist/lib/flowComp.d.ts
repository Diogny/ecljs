import { Type, IPoint, IItemSolidDefaults } from "./interfaces";
import Size from "./size";
import ItemSolid from "./itemSolid";
import Flowchart from "./flowchart";
/**
 * @description flowchart base component class
 */
export default abstract class FlowComp extends ItemSolid {
    get type(): Type;
    get size(): Size;
    set size(value: Size);
    abstract onResize(size: Size): void;
    get inputs(): number;
    get outputs(): number;
    constructor(flowchart: Flowchart, options: {
        [x: string]: any;
    });
    setNode(node: number, p: IPoint): FlowComp;
    defaults(): IItemSolidDefaults;
}
