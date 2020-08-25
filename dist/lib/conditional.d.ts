import { IFlowCondDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
import Size from "./size";
export default class FlowConditional extends FlowComp {
    protected $: IFlowCondDefaults;
    constructor(flowchart: Flowchart, options: {
        [x: string]: any;
    });
    refresh(): FlowConditional;
    onResize(size: Size): void;
}
