import { IBaseComponent, IPoint } from "./interfaces";
import Rect from "./rect";
import Bond from "./bonds";
import ItemBoard from "./itemsBoard";
import Wire from "./wire";
export default abstract class ComponentContainer<T extends ItemBoard> {
    abstract get name(): string;
    abstract get library(): string;
    abstract get directionalWires(): boolean;
    uniqueCounters: any;
    compMap: Map<string, IBaseComponent>;
    itemMap: Map<string, {
        c: T;
        b: Bond[];
    }>;
    wireMap: Map<string, {
        c: Wire;
        b: Bond[];
    }>;
    selectedComponents: T[];
    get itemList(): T[];
    get wireList(): Wire[];
    get empty(): boolean;
    get components(): (T | Wire)[];
    get size(): number;
    get(id: string): T | Wire | undefined;
    __modified: boolean;
    get modified(): boolean;
    set modified(value: boolean);
    constructor();
    rootComponent(name: string): IBaseComponent | undefined;
    hasComponent(id: string): boolean;
    selectAll(value: boolean): T[];
    toggleSelect(comp: T): void;
    selectThis(comp: T): boolean;
    unselectThis(comp: T): void;
    selectRect(rect: Rect): void;
    deleteSelected(): number;
    destroy(): void;
    boundariesRect(): Rect;
    abstract createItem(options: {
        name: string;
        x: number;
        y: number;
        points: IPoint[];
    }): T;
    add(options: {
        name: string;
        x: number;
        y: number;
        points: IPoint[];
    }): T | Wire;
    delete(comp: T | Wire): boolean;
    itemBonds(item: T | Wire): Bond[] | undefined;
    nodeBonds(item: T | Wire, node: number): Bond | undefined;
    bond(thisObj: T | Wire, thisNode: number, ic: T | Wire, icNode: number): boolean;
    protected bondSingle(thisObj: T | Wire, thisNode: number, ic: T | Wire, icNode: number, origin: boolean): boolean;
    unbond(thisObj: T | Wire, node: number, id: string): void;
    unbondNode(thisObj: T | Wire, node: number): void;
    disconnect(thisObj: T | Wire): void;
    getAllBonds(): string[];
    abstract getXML(): string;
}
