import { IItemSolidOptions, IItemSolidProperties, IPoint, INodeInfo } from "./interfaces";
import Rect from "./rect";
import Point from "./point";
import ItemBoard from "./itemsBoard";
import Container from "./container";
export default abstract class ItemSolid extends ItemBoard {
    protected __s: IItemSolidProperties;
    get last(): number;
    get count(): number;
    constructor(container: Container<ItemBoard>, options: IItemSolidOptions);
    get rotation(): number;
    rotate(value: number): ItemSolid;
    move(x: number, y: number): ItemSolid;
    rect(): Rect;
    valid(node: number): boolean;
    hghlightable(name: number): boolean;
    findNode(p: Point): number;
    static nodeArea: number;
    overNode(p: IPoint, ln?: number): number;
    nodeRefresh(node: number): ItemSolid;
    refresh(): ItemSolid;
    /**
     *
     * @param pinNode pin/node number
     * @param onlyPoint true to get internal rotated point only without transformations
     */
    getNode(pinNode: number, onlyPoint?: boolean): INodeInfo | undefined;
}
