import { IBaseComponent, IContainerProperties, Base } from "./interfaces";
import Rect from "./rect";
import Bond from "./bonds";
import ItemBoard from "./itemsBoard";
import Wire from "./wire";
import Board from "./board";
export default abstract class Container<T extends ItemBoard> extends Base {
    protected __s: IContainerProperties<T>;
    get name(): string;
    set name(value: string);
    get board(): Board;
    set board(board: Board);
    abstract get library(): string;
    abstract get directional(): boolean;
    abstract createItem(options: {
        [x: string]: any;
    }): T;
    get counters(): {
        [x: string]: any;
    };
    get components(): Map<string, IBaseComponent>;
    get itemMap(): Map<string, {
        t: T;
        b: Bond[];
        c: number;
    }>;
    get wireMap(): Map<string, {
        t: Wire;
        b: Bond[];
        c: number;
    }>;
    get selected(): (T | Wire)[];
    get items(): T[];
    get wires(): Wire[];
    get all(): (T | Wire)[];
    get empty(): boolean;
    get size(): number;
    get registered(): boolean;
    get(id: string): T | Wire | undefined;
    get modified(): boolean;
    set modified(value: boolean);
    /**
     * @description sets the container modified flag, but doesn't rise a modified event to parent board
     * @param value modified value
     */
    setModified(value: boolean): void;
    constructor(name: string);
    defaults(): IContainerProperties<T>;
    root(name: string): IBaseComponent | undefined;
    hasItem(id: string): boolean;
    selectAll(value: boolean): (T | Wire)[];
    toggleSelect(comp: T): void;
    selectThis(comp: T | Wire): boolean;
    unselectThis(comp: T): void;
    selectRect(rect: Rect): void;
    deleteSelected(): number;
    destroy(): void;
    boundariesRect(): Rect;
    add(options: {
        [x: string]: any;
    }): T | Wire;
    delete(comp: T | Wire): boolean;
    itemBonds(item: T | Wire): Bond[] | undefined;
    nodeBonds(item: T | Wire, node: number): Bond | undefined;
    bond(thisObj: T | Wire, thisNode: number, ic: T | Wire, icNode: number): boolean;
    protected bondOneWay(thisObj: T | Wire, thisNode: number, ic: T | Wire, icNode: number, origin: boolean): boolean;
    unbond(thisObj: T | Wire, node: number, id: string): void;
    unbondNode(thisObj: T | Wire, node: number): void;
    disconnect(thisObj: T | Wire): void;
    getAllBonds(): string[];
    moveBond(id: string, node: number, newIndex: number): void;
}
