import { IPoint } from 'dabbjs/dist/lib/interfaces';
import { IItemBoardDefaults, INodeInfo, ComponentPropertyType, IItemBoardPropEvent, IUnbondNodeData, IUnbondData } from './interfaces';
import Bond from './bonds';
import ItemBase from './itemsBase';
import Container from './container';
export default abstract class ItemBoard extends ItemBase {
    container: Container<ItemBoard>;
    protected $: IItemBoardDefaults;
    get onProp(): (args: IItemBoardPropEvent) => void;
    get selected(): boolean;
    get bonds(): Bond[] | undefined;
    get dir(): boolean;
    abstract get count(): number;
    abstract get last(): number;
    abstract refresh(): ItemBoard;
    abstract node(node: number, nodeOnly?: boolean): INodeInfo | undefined;
    constructor(container: Container<ItemBoard>, options: {
        [x: string]: any;
    });
    select(value: boolean): ItemBoard;
    valid(node: number): boolean;
    highlightable(node: number): boolean;
    move(x: number, y: number): ItemBoard;
    static nodeArea: number;
    /**
     * @description detects a point over a node
     * @param p point to check for component node
     * @param ln 1-based line number, for EC it's discarded
     */
    over(p: IPoint, ln?: number): number;
    nodeRefresh(node: number): ItemBoard;
    /**
     * @description sets node new location. Only works for Wire
     * @param node 0-base node
     * @param p new location
     */
    setNode(node: number, p: IPoint): ItemBoard;
    setOnProp(value: (args: IItemBoardPropEvent) => void): ItemBoard;
    /**
     * @description returns true if there's at least one node highlighted.
     */
    get isHighlighted(): boolean;
    /**
     * @description returns highlighted status of a node, or sets it's status
     * @param node 0-based node
     * @param value undefined: returns Highlighter; true: highlights; false: removes highlight
     * @returns Highlighter for get if exists & set to true; otherwise undefined
     */
    highlighted(node: number, value?: boolean): boolean | undefined;
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
    /**
     * @description bonds two components two-way
     * @param node 0-based node
     * @param ic component to bond to
     * @param icNode component node
     */
    bond(node: number, ic: ItemBoard, icNode: number): boolean;
    nodeBonds(node: number): Bond | undefined;
    /**
     * @description unbonds a node from a component
     * @param node 0-base node to unbond
     * @param id component to unbond from
     */
    unbond(node: number, id: string): IUnbondData | undefined;
    /**
     * @description unbonds a node
     * @param node 0-base node
     * @returns undefined if invalid node, otherwise list of disconnected wire ids
     */
    unbondNode(node: number): IUnbondNodeData | undefined;
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
