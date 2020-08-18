import { Type, IPoint, IWireDefaults, INodeInfo } from './interfaces';
import Point from './point';
import Rect from './rect';
import ItemBoard from './itemsBoard';
import Container from './container';
export default class Wire extends ItemBoard {
    protected $: IWireDefaults;
    get type(): Type;
    get count(): number;
    get last(): number;
    get lastLine(): number;
    get isOpen(): boolean;
    rect(): Rect;
    get points(): Point[];
    get editMode(): boolean;
    set editMode(value: boolean);
    constructor(container: Container<ItemBoard>, options: {
        [x: string]: any;
    });
    refresh(): Wire;
    nodeRefresh(node: number): Wire;
    setNode(node: number, p: IPoint): Wire;
    translate(dx: number, dy: number): Wire;
    /**
     * @description returns true if a point is valid
     * @comment later see how to change this to validNode, conflict in !ic.valid(node)
     * 		because we don't know if it's a IC or a wire
     * @param {number} node 0-based point index	it can be -1
     * @returns {boolean} true if point is valid
     */
    valid(node: number): boolean;
    appendNode(p: Point): boolean;
    highlightable(node: number): boolean;
    protected setPoints(points: IPoint[]): Wire;
    getNode(node: number, onlyPoint?: boolean): INodeInfo | undefined;
    static nodeArea: number;
    overNode(p: IPoint, ln?: number): number;
    deleteLine(line: number): boolean;
    deleteNode(node: number): Point | undefined;
    insertNode(node: number, p: Point): boolean;
    /**
     * @description standarizes a wire node number to 0..points.length
     * @param {number} node 0-based can be -1:last 0..points.length-1
     * @returns {number} -1 for wrong node or standarized node number, where -1 == last, otherwise node
     */
    standarizeNode(node: number): number;
    defaults(): IWireDefaults;
}
