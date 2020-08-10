import FlowchartComp from "./flowchartComp";
import Point from "./point";
import Size from "./size";
export default class FlowConditional extends FlowchartComp {
    get fontSize(): number;
    get text(): string;
    setText(value: string): FlowConditional;
    get position(): Point;
    onResize(size: Size): void;
}
