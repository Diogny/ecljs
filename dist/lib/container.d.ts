import { IBaseComponent, IContainerProperties, BaseSettings } from "./interfaces";
import Rect from "./rect";
import Bond from "./bonds";
import ItemBoard from "./itemsBoard";
import Wire from "./wire";
export default abstract class Container<T extends ItemBoard> extends BaseSettings {
    get name(): string;
    set name(value: string);
    abstract get library(): string;
    abstract get directionalWires(): boolean;
    protected settings: IContainerProperties<T>;
    get uniqueCounters(): {
        [x: string]: any;
    };
    get componentTemplates(): Map<string, IBaseComponent>;
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
    get components(): T[];
    get wires(): Wire[];
    get all(): (T | Wire)[];
    get empty(): boolean;
    get size(): number;
    get(id: string): T | Wire | undefined;
    get modified(): boolean;
    set modified(value: boolean);
    constructor(name: string);
    propertyDefaults(): IContainerProperties<T>;
    rootComponent(name: string): IBaseComponent | undefined;
    hasComponent(id: string): boolean;
    selectAll(value: boolean): (T | Wire)[];
    toggleSelect(comp: T): void;
    selectThis(comp: T | Wire): boolean;
    unselectThis(comp: T): void;
    selectRect(rect: Rect): void;
    deleteSelected(): number;
    destroy(): void;
    boundariesRect(): Rect;
    abstract createItem(options: {
        [x: string]: any;
    }): T;
    add(options: {
        [x: string]: any;
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
    moveBond(id: string, node: number, newIndex: number): void;
}
