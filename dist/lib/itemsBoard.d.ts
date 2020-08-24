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
    abstract get count(): number;
    abstract valid(node: number): boolean;
    abstract get last(): number;
    abstract refresh(): ItemBoard;
    abstract nodeRefresh(node: number): ItemBoard;
    abstract node(node: number, nodeOnly?: boolean): INodeInfo | undefined;
    abstract setNode(node: number, p: IPoint): ItemBoard;
    abstract overNode(p: IPoint, ln?: number): number;
    constructor(container: Container<ItemBoard>, options: {
        [x: string]: any;
    });
    select(value: boolean): ItemBoard;
    move(x: number, y: number): ItemBoard;
    setOnProp(value: (args: IItemBoardPropEvent) => void): ItemBoard;
    abstract highlightable(node: number): boolean;
    /**
     * @description returns true if there's at least one node highlighted
     */
    get isHighlighted(): boolean;
    /**
     * @description returns highlighted status of a node, or sets it's status
     * @param node 0-based node
     * @param value undefined: returns Highlighter; true: highlights; false: removes highlight
     * @returns Highlighter for get if exists & set to true; otherwise undefined
     */
    highlighted(node: number, value?: boolean): CompNode | undefined;
    /**
     * @description show/hide all node highlighted
     * @param value true shows all nodes highlighted, false removes all highlights
     */
    highlight(value: boolean): void;
    /**
     * @description removes all highlights except for this node
     * @param node 0-base node
     */
    highlightThis(node: number): void;
    /**
     * @description refreshes the node highlight position, useful for wire node draggings
     * @param node 0-base node
     */
    refreshHighlight(node: number): boolean;
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
    prop(name: string): ComponentPropertyType;
    /**
     * @description returns all custom properties of this component
     */
    get props(): {
        [x: string]: ComponentPropertyType;
    };
    defaults(): IItemBoardDefaults;
}
