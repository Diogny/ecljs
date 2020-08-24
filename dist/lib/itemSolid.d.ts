import { IItemSolidDefaults, IPoint, INodeInfo } from "./interfaces";
import Rect from "./rect";
import ItemBoard from "./itemsBoard";
import Container from "./container";
export default abstract class ItemSolid extends ItemBoard {
    protected $: IItemSolidDefaults;
    get last(): number;
    get count(): number;
    constructor(container: Container<ItemBoard>, options: {
        [x: string]: any;
    });
    get rot(): number;
    /**
     * @description sets rotation of this component to this amount 0-360°
     * @param value 0-360° number value
     */
    rotate(value: number): ItemSolid;
    move(x: number, y: number): ItemSolid;
    rect(): Rect;
    valid(node: number): boolean;
    highlightable(node: number): boolean;
    static nodeArea: number;
    /**
     * @description detects a point over a node
     * @param p point to check for component node
     * @param ln 1-based line number, for EC it's discarded
     */
    over(p: IPoint, ln?: number): number;
    nodeRefresh(node: number): ItemSolid;
    refresh(): ItemSolid;
    /**
     * @description returns the node information
     * @param node 0-based pin/node number
     * @param onlyPoint true to get internal rotated point only without transformations
     *
     * this returns (x, y) relative to the EC location
     */
    node(node: number, nodeOnly?: boolean): INodeInfo | undefined;
    defaults(): IItemSolidDefaults;
}
