"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const label_1 = (0, tslib_1.__importDefault)(require("./label"));
const misc_1 = require("dabbjs/dist/lib/misc");
//internal class
class ConditionalLabel extends label_1.default {
    constructor(options) {
        //fontSize default Label::fontSize = 15
        options.visible = false;
        isNaN(options.node) && (options.node = -1);
        super(options);
    }
    /**
     * @description liked 0-base node, -1 if not linked
     */
    get node() { return this.$.node; }
    set node(value) { this.$.node = value; }
    defaults() {
        return (0, misc_1.extend)(super.defaults(), {
            node: -1
        });
    }
}
exports.default = ConditionalLabel;
//# sourceMappingURL=flowCondLabel.js.map