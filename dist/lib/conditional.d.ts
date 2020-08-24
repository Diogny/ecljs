import FlowComp from "./flowComp";
import Point from "./point";
import Size from "./size";
export default class FlowConditional extends FlowComp {
    get fontSize(): number;
    get text(): string;
    setText(value: string): FlowConditional;
    get position(): Point;
    onResize(size: Size): void;
}
