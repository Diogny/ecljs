import Container from "./container";
import FlowComp from "./flowComp";
import Wire from "./wire";
import { IUnbondNodeData, IUnbondData } from "./interfaces";
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
    unbond(thisObj: FlowComp | Wire, node: number, id: string): IUnbondData | undefined;
    /**
     * @description fully unbonds a component node
     * @param thisObj component
     * @param node 0-base node
     * @returns an structure with unbonded information
     */
    unbondNode(thisObj: FlowComp | Wire, node: number): IUnbondNodeData | undefined;
}
