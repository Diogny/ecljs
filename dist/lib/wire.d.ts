import { IPoint } from 'dabbjs/dist/lib/interfaces';
import Point from 'dabbjs/dist/lib/point';
import Rect from 'dabbjs/dist/lib/rect';
import { Type, IWireDefaults, INodeInfo } from './interfaces';
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
    get edit(): boolean;
    /**
     * @description get/set wire edit mode
     */
    set edit(value: boolean);
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
    /**
     * @description appends a new node at the end, only works in edit mode, creating a wire
     * @param p new point
     */
    append(p: Point): boolean;
    highlightable(node: number): boolean;
    protected setPoints(points: IPoint[]): Wire;
    /**
     * @description returns the node information
     * @param node 0-based pin/node number
     * @param onlyPoint it's discarded
     *
     * this returns absolute (x, y) position
     */
    node(node: number, onlyPoint?: boolean): INodeInfo | undefined;
    static nodeArea: number;
    /**
     * @description detects a point over a node
     * @param p point to check for component node
     * @param ln 1-based line number, ln undefined or 0, checks the whole wire, otherwise just check this line
     */
    over(p: IPoint, ln?: number): number;
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
