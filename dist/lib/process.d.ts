import { IFlowProcessDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
export default class FlowProcess extends FlowComp {
    protected $: IFlowProcessDefaults;
    constructor(flowchart: Flowchart, options: {
        [x: string]: any;
    });
    refresh(): FlowProcess;
}
