import Point from "./point";
import Size from "./size";
import FlowchartComponent from "./flowchartComponent";
export default class FlowProcess extends FlowchartComponent {
    get fontSize(): number;
    get text(): string;
    setText(value: string): FlowProcess;
    get position(): Point;
    onResize(size: Size): void;
}
