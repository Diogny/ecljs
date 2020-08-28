import Size from "dabbjs/dist/lib/size";
import FlowComp from "./flowComp";
export default abstract class FlowTerminational extends FlowComp {
    onResize(size: Size): void;
}
