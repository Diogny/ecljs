import FlowchartComp from "./flowchartComp";
import Size from "./size";
export default abstract class FlowTerminational extends FlowchartComp {
    onResize(size: Size): void;
}
