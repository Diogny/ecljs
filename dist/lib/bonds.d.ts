import { Type, TypedClass } from './types';
import ItemBoard from './itemsBoard';
import { IBondItem } from './interfaces';
export default class Bond implements TypedClass {
    from: IBondItem;
    to: IBondItem[];
    get type(): Type;
    get count(): number;
    get link(): string;
    /**
     * @description implements a component bond, it must be created by default as a One-to-One bond
     * @param {object} _from from
     * @param {object} _to to
     * @param {number} node node
     * @param {any} pin pin
     */
    constructor(from: ItemBoard, to: ItemBoard, node: number, pin: number);
    has(id: string): boolean;
    get(id: string): IBondItem | undefined;
    add(t: ItemBoard, ndx: number): boolean;
    private create;
    /**
     * @description removes a bond connection from this component item
     * @param {String} id id name of the destination bond
     * @returns {IBondItem} removed bond item or null if none
     */
    remove(id: string): IBondItem | null;
    toString: () => string;
    static display: (arr: Bond[]) => string[];
}
