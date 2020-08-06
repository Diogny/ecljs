import { IType, IBondLink, Type } from './interfaces';
import ItemBoard from './itemsBoard';
export default class Bond implements IType {
    origin: boolean;
    from: IBondLink;
    to: IBondLink[];
    get type(): Type;
    get count(): number;
    get link(): string;
    /**
     * @description implements a component bond, it must be created by default as a One-to-One bond
     * @param {object} from from
     * @param {object} to to
     * @param {number} toNode node
     * @param {any} fromPin pin
     */
    constructor(from: ItemBoard, fromPin: number, to: ItemBoard, toNode: number, origin: boolean);
    has(id: string): boolean;
    get(id: string): IBondLink | undefined;
    add(t: ItemBoard, ndx: number): boolean;
    private create;
    /**
     * @description removes a bond connection from this component item
     * @param {String} id id name of the destination bond
     * @returns {IBondLink} removed bond item or null if none
     */
    remove(id: string): IBondLink | null;
    toString: () => string;
    static display: (arr: Bond[] | undefined) => string[];
}
