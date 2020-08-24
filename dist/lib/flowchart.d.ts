import Container from "./container";
import FlowchartComp from "./flowchartComp";
import Wire from "./wire";
export default class Flowchart extends Container<FlowchartComp> {
    get name(): string;
    get dir(): boolean;
    createItem(options: {
        [x: string]: any;
    }): FlowchartComp;
    bond(thisObj: FlowchartComp | Wire, thisNode: number, ic: FlowchartComp | Wire, icNode: number): boolean;
}
