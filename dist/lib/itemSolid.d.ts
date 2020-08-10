import { IItemSolidOptions, IItemSolidProperties, IPoint, IItemNode } from "./interfaces";
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
    overNode(p: IPoint, ln: number): number;
    nodeRefresh(node: number): ItemSolid;
    refresh(): ItemSolid;
    getNode(pinNode: number): IItemNode;
    getNodeRealXY(node: number): Point;
}
