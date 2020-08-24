import { IType, IBondNode, Type, BondDir } from './interfaces';
import ItemBoard from './itemsBoard';
export default class Bond implements IType {
    dir: BondDir;
    from: IBondNode;
    to: IBondNode[];
    get type(): Type;
    get count(): number;
    get link(): string;
    /**
     * @description implements a component bond, it must be created by default as a One-to-One bond
     * @param from component
     * @param fromPin component's pin/node
     * @param to component
     * @param toNode component's pini/node
     * @param dir direction of the bond: 0=origin, A to B; or 1=dest, B to A
     */
    constructor(from: ItemBoard, fromPin: number, to: ItemBoard, toNode: number, dir: BondDir);
    has(id: string): boolean;
    get(id: string): IBondNode | undefined;
    add(t: ItemBoard, ndx: number): boolean;
    private create;
    /**
     * @description removes a bond connection from this component item
     * @param {String} id id name of the destination bond
     * @returns {IBondNode} removed bond item or null if none
     */
    remove(id: string): IBondNode | null;
    toString: () => string;
    static display: (arr: Bond[] | undefined) => string[];
}
