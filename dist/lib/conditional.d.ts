import { IFlowCondDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
export default class FlowConditional extends FlowComp {
    protected $: IFlowCondDefaults;
    constructor(flowchart: Flowchart, options: {
        [x: string]: any;
    });
    refresh(): FlowConditional;
}
