import { IPoint } from "./interfaces";
import Container from "./container";
import FlowchartComponent from "./flowchartComponent";
import Wire from "./wire";
export default class Flowchart extends Container<FlowchartComponent> {
    get name(): string;
    get library(): string;
    get directionalWires(): boolean;
    createItem(options: {
        name: string;
        x: number;
        y: number;
        points: IPoint[];
    }): FlowchartComponent;
    bond(thisObj: FlowchartComponent | Wire, thisNode: number, ic: FlowchartComponent | Wire, icNode: number): boolean;
}
