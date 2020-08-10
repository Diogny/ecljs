import Point from "./point";
import Size from "./size";
import FlowchartComp from "./flowchartComp";
export default class FlowProcess extends FlowchartComp {
    get fontSize(): number;
    get text(): string;
    setText(value: string): FlowProcess;
    get position(): Point;
    onResize(size: Size): void;
}
