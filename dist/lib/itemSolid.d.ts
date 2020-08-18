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
    get rotation(): number;
    rotate(value: number): ItemSolid;
    move(x: number, y: number): ItemSolid;
    rect(): Rect;
    valid(node: number): boolean;
    hghlightable(node: number): boolean;
    static nodeArea: number;
    overNode(p: IPoint, ln?: number): number;
    nodeRefresh(node: number): ItemSolid;
    refresh(): ItemSolid;
    /**
     *
     * @param pinNode pin/node number
     * @param onlyPoint true to get internal rotated point only without transformations
     */
    getNode(node: number, nodeOnly?: boolean): INodeInfo | undefined;
    defaults(): IItemSolidDefaults;
}
