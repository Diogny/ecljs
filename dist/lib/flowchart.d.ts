import Container from "./container";
import FlowComp from "./flowComp";
import Wire from "./wire";
import { BondDir } from "./interfaces";
/**
 * @description Flowchart component container
 */
export default class Flowchart extends Container<FlowComp> {
    get name(): string;
    get dir(): boolean;
    createItem(options: {
        [x: string]: any;
    }): FlowComp;
    bond(thisObj: FlowComp | Wire, thisNode: number, ic: FlowComp | Wire, icNode: number): boolean;
    unbond(thisObj: FlowComp | Wire, node: number, id: string): BondDir | undefined;
    unbondNode(thisObj: FlowComp | Wire, node: number): {
        dir: BondDir;
        ids: string[];
    } | undefined;
}
