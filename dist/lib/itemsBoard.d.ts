import { IPoint, IItemBoardProperties, IItemBaseOptions, INodeInfo } from './interfaces';
import Bond from './bonds';
import ItemBase from './itemsBase';
import Container from './container';
export default abstract class ItemBoard extends ItemBase {
    container: Container<ItemBoard>;
    protected __s: IItemBoardProperties;
    get onProp(): Function;
    get selected(): boolean;
    get bonds(): Bond[] | undefined;
    get directional(): boolean;
    get label(): string;
    abstract get count(): number;
    abstract valid(node: number): boolean;
    abstract get last(): number;
    abstract refresh(): ItemBoard;
    abstract nodeRefresh(node: number): ItemBoard;
    abstract getNode(node: number, onlyPoint?: boolean): INodeInfo | undefined;
    abstract setNode(node: number, p: IPoint): ItemBoard;
    abstract overNode(p: IPoint, ln?: number): number;
    abstract hghlightable(node: number): boolean;
    constructor(container: Container<ItemBoard>, options: IItemBaseOptions);
    select(value: boolean): ItemBoard;
    move(x: number, y: number): ItemBoard;
    setOnProp(value: Function): ItemBoard;
    bond(thisNode: number, ic: ItemBoard, icNode: number): boolean;
    nodeBonds(node: number): Bond | undefined;
    unbond(node: number, id: string): void;
    unbondNode(node: number): void;
    disconnect(): void;
    defaults(): IItemBoardProperties;
}
