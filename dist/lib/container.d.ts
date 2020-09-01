import Rect from "dabbjs/dist/lib/rect";
import { IBaseComponent, IContainerDefaults, Base, BondDir, IUnbondNodeData, IUnbondData } from "./interfaces";
import Bond from "./bonds";
import ItemBoard from "./itemsBoard";
import Wire from "./wire";
import CompStore from "./components";
export default abstract class Container<T extends ItemBoard> extends Base {
    protected $: IContainerDefaults<T>;
    abstract get name(): string;
    abstract get dir(): boolean;
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
    get store(): CompStore;
    get(id: string): T | Wire | undefined;
    /**
     * @description creates a library component container
     * @param options configurable options, see below:
     *
     * - store: CompStore;  component store
     */
    constructor(options: {
        [x: string]: any;
    });
    defaults(): IContainerDefaults<T>;
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
    /**
     * @description adds a new component to this container
     * @param options disctionary of options
     */
    add(options: {
        [x: string]: any;
    }): T | Wire;
    delete(comp: T | Wire): boolean;
    itemBonds(item: T | Wire): Bond[] | undefined;
    nodeBonds(item: T | Wire, node: number): Bond | undefined;
    bond(thisObj: T | Wire, thisNode: number, ic: T | Wire, icNode: number): boolean;
    protected bondOneWay(thisObj: T | Wire, thisNode: number, ic: T | Wire, icNode: number, dir: BondDir): boolean;
    unbond(thisObj: T | Wire, node: number, id: string): IUnbondData | undefined;
    /**
     * @description unbonds a component node
     * @param thisObj component to be unbonded
     * @param node 0-based node
     * @returns undefined if not bonded, otherwise thisObj::Bond.dir and list of disconnected wire ids
     */
    unbondNode(thisObj: T | Wire, node: number): IUnbondNodeData | undefined;
    disconnect(thisObj: T | Wire): void;
    getAllBonds(): string[];
    moveBond(id: string, node: number, newIndex: number): void;
}
