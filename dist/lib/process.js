import { attr } from "dabbjs/dist/lib/dom";
import { Rect } from "dabbjs/dist/lib/rect";
import { FlowComp } from "./flowComp";
export class FlowProcess extends FlowComp {
    /**
     * contains the main frame body, where full component size can be calculated
     */
    get body() { return this.$.rect; }
    /**
     * client rect where text should be safely contained
     */
    get clientRect() {
        let s = this.size;
        return (new Rect(0, 0, s.width | 0, s.height | 0)).grow(-this.$.padding, -this.$.padding);
    }
    constructor(flowchart, options) {
        super(flowchart, options);
        this.$.rect = this.g.firstElementChild;
        this.onResize(this.size);
    }
    /**
     * @description refreshes flowchart location, size, and updates bonded cmoponents
     */
    refresh() {
        attr(this.$.rect, {
            width: this.size.width,
            height: this.size.height
        });
        return super.refresh(), this;
    }
}
