import Container from "./container";
import FlowchartComponent from "./flowchartComponent";
import Wire from "./wire";
export default class Flowchart extends Container<FlowchartComponent> {
    get library(): string;
    get directionalWires(): boolean;
    createItem(options: {
        [x: string]: any;
    }): FlowchartComponent;
    bond(thisObj: FlowchartComponent | Wire, thisNode: number, ic: FlowchartComponent | Wire, icNode: number): boolean;
}
