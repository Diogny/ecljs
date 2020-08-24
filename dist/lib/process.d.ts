import Point from "./point";
import Size from "./size";
import FlowComp from "./flowComp";
export default class FlowProcess extends FlowComp {
    get fontSize(): number;
    get text(): string;
    setText(value: string): FlowProcess;
    get position(): Point;
    onResize(size: Size): void;
}
