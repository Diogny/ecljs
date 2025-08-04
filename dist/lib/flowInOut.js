import { attr } from "dabbjs/dist/lib/dom";
import { Rect } from "dabbjs/dist/lib/rect";
import { FlowComp } from "./flowComp";
import { flowNodes } from "./extra";
export class FlowInOut extends FlowComp {
    /**
    * contains the main frame body, where full component size can be calculated
    */
    get body() { return this.$.path; }
    /**
     * client rect where text should be safely contained
     */
    get clientRect() {
        let s = this.size;
        return (new Rect(0, 0, s.width | 0, s.height | 0)).grow(-this.$.shift, -this.$.padding);
    }
    constructor(flowchart, options) {
        super(flowchart, options);
        this.$.path = this.g.firstElementChild;
        this.onResize(this.size);
    }
    /**
     * @description refreshes flowchart location, size, and updates bonded cmoponents
     */
    refresh() {
        let s = this.$.shift, w = this.size.width, s2 = w - s;
        attr(this.$.path, {
            d: `M ${s},0 H${w} L${s2},${this.size.height} H0 Z`
        });
        return super.refresh(), this;
    }
    /**
     * @description perform node readjustment, it calls refresh() function
     * @param size new size
     */
    onResize(size) {
        let list = this.$.nodes, xs = (this.$.shift = this.size.height / 4 | 0) / 2 | 0;
        flowNodes(list, size);
        list[1].x -= xs;
        list[3].x = xs;
        this.refresh();
    }
}
