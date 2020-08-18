import { IPoint, IItemBoardDefaults, INodeInfo, ComponentPropertyType, IItemBoardPropEvent } from './interfaces';
import Bond from './bonds';
import ItemBase from './itemsBase';
import Container from './container';
import CompNode from './compNode';
export default abstract class ItemBoard extends ItemBase {
    container: Container<ItemBoard>;
    protected $: IItemBoardDefaults;
    get onProp(): (args: IItemBoardPropEvent) => void;
    get selected(): boolean;
    get bonds(): Bond[] | undefined;
    get dir(): boolean;
    get highlights(): CompNode[];
    get highlighted(): boolean;
    abstract get count(): number;
    abstract valid(node: number): boolean;
    abstract get last(): number;
    abstract refresh(): ItemBoard;
    abstract nodeRefresh(node: number): ItemBoard;
    abstract getNode(node: number, nodeOnly?: boolean): INodeInfo | undefined;
    abstract setNode(node: number, p: IPoint): ItemBoard;
    abstract overNode(p: IPoint, ln?: number): number;
    abstract hghlightable(node: number): boolean;
    constructor(container: Container<ItemBoard>, options: {
        [x: string]: any;
    });
    select(value: boolean): ItemBoard;
    move(x: number, y: number): ItemBoard;
    setOnProp(value: (args: IItemBoardPropEvent) => void): ItemBoard;
    /**
     * @description highlights a node, or keeps highlighting more nodes
     * @param node 0-base node to be highlighted
     * @param multiple false is default, so it highlights only this node, true is multiple highlighted nodes
     */
    highlightNode(node: number, multiple?: boolean): boolean | undefined;
    /**
     * @description show/hide all node highlighted
     * @param value true shows all nodes highlighted, false removes all highlights
     */
    highlight(value: boolean): void;
    bond(thisNode: number, ic: ItemBoard, icNode: number): boolean;
    nodeBonds(node: number): Bond | undefined;
    unbond(node: number, id: string): void;
    /**
     * @description unbonds a node
     * @param node 0-base node
     * @returns undefined if invalid node, otherwise list of disconnected wire ids
     */
    unbondNode(node: number): string[] | undefined;
    remove(): void;
    disconnect(): void;
    prop(propName: string): ComponentPropertyType;
    defaults(): IItemBoardDefaults;
}
