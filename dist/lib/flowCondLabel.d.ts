import { IConditionalLabel } from "./interfaces";
import { Label } from "./label";
export declare class ConditionalLabel extends Label {
    protected $: IConditionalLabel;
    /**
     * @description liked 0-base node, -1 if not linked
     */
    get node(): number;
    set node(value: number);
    constructor(options: {
        [x: string]: any;
    });
    defaults(): IConditionalLabel;
}
