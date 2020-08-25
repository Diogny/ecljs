import FlowComp from "./flowComp";
import Size from "./size";
export default abstract class FlowTerminational extends FlowComp {
    onResize(size: Size): void;
}
