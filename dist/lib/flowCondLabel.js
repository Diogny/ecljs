import { Label } from "./label";
import { extend } from "dabbjs/dist/lib/misc";
//internal class
export class ConditionalLabel extends Label {
    /**
     * @description liked 0-base node, -1 if not linked
     */
    get node() { return this.$.node; }
    set node(value) { this.$.node = value; }
    constructor(options) {
        //fontSize default Label::fontSize = 15
        options.visible = false;
        isNaN(options.node) && (options.node = -1);
        super(options);
    }
    defaults() {
        return extend(super.defaults(), {
            node: -1
        });
    }
}
