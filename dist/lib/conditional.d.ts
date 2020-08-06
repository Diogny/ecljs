import FlowchartComponent from "./flowchartComponent";
import Point from "./point";
import Size from "./size";
export default class FlowConditional extends FlowchartComponent {
    get fontSize(): number;
    get text(): string;
    setText(value: string): FlowConditional;
    get position(): Point;
    onResize(size: Size): void;
}
