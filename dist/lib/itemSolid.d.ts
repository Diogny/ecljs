import { Rect } from "dabbjs/dist/lib/rect";
import { IItemSolidDefaults, INodeInfo } from "./interfaces";
import { ItemBoard } from "./itemsBoard";
import { Container } from "./container";
export declare abstract class ItemSolid extends ItemBoard {
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
    rect(): Rect;
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
