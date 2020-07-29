import ItemBoard from "./itemsBoard";
import { IItemSolidOptions, IItemSolidProperties } from "./interfaces";
import ItemBase from "./itemsBase";
import Rect from "./rect";
import Circuit from "./circuit";
export default abstract class ItemSolid extends ItemBoard {
    protected settings: IItemSolidProperties;
    constructor(circuit: Circuit, options: IItemSolidOptions);
    get rotation(): number;
    rotate(value: number): ItemBase;
    rect(): Rect;
}
