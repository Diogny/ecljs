"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const misc_1 = require("dabbjs/dist/lib/misc");
const dom_1 = require("dabbjs/dist/lib/dom");
const interfaces_1 = require("./interfaces");
const itemsBase_1 = (0, tslib_1.__importDefault)(require("./itemsBase"));
class HighlightNode extends itemsBase_1.default {
    constructor(options) {
        //override
        options.selectedNode = -1;
        options.selectedId = "";
        //options.id = "highlighNode";
        super(options);
        this.g.setAttribute("svg-comp", "h-node");
        this.$.mainNode = (0, dom_1.tag)("circle", "", {
            "svg-type": "node",
            r: this.radius
        });
        this.g.append(this.$.mainNode);
    }
    get type() { return interfaces_1.Type.HL; }
    get radius() { return this.$.radius; }
    get selectedId() { return this.$.selectedId; }
    get selectedNode() { return this.$.selectedNode; }
    setRadius(value) {
        this.$.mainNode.setAttribute("r", (this.$.radius = value <= 0 ? 5 : value));
        return this;
    }
    hide() {
        this.g.classList.add("hide");
        this.$.mainNode.classList.remove("hide");
        this.g.innerHTML = "";
        this.g.append(this.$.mainNode);
        return this;
    }
    show(x, y, id, node) {
        this.move(x, y);
        (0, dom_1.attr)(this.$.mainNode, {
            cx: this.x,
            cy: this.y,
            //"node-x": <any>node,
            "node": (this.$.selectedNode = node)
        });
        this.$.selectedId = id;
        this.g.classList.remove("hide");
        return this;
    }
    showConnections(nodes) {
        this.$.mainNode.classList.add("hide");
        this.g.classList.remove("hide");
        nodes.forEach(p => {
            let circle = (0, dom_1.tag)("circle", "", {
                cx: p.x,
                cy: p.y,
                r: this.radius,
                class: "node",
            });
            this.g.append(circle);
        });
        return this;
    }
    defaults() {
        return (0, misc_1.extend)(super.defaults(), {
            name: "h-node",
            class: "h-node",
            visible: false,
            radius: 5
        });
    }
}
exports.default = HighlightNode;
