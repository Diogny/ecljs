import { Container } from "./container";
import { FlowComp } from "./flowComp";
import { Wire } from "./wire";
import { IUnbondNodeData, IUnbondData, IFlowchartDefaults, IFlowResizePolicy } from "./interfaces";
/**
 * @description Flowchart component container
 */
export declare class Flowchart extends Container<FlowComp> {
    protected $: IFlowchartDefaults;
    get name(): string;
    get dir(): boolean;
    /**
     * Returns the resize policy for this flowchart container
     */
    get reSizePolicy(): IFlowResizePolicy;
    /**
     * @description creates a flowchart component
     * @param options customizable options
     */
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
    defaults(): IFlowchartDefaults;
}
