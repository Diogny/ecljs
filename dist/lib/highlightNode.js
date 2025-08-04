import { extend } from "dabbjs/dist/lib/misc";
import { tag, attr } from "dabbjs/dist/lib/dom";
import { Type } from "./interfaces";
import { ItemBase } from "./itemsBase";
export class HighlightNode extends ItemBase {
    get type() { return Type.HL; }
    get radius() { return this.$.radius; }
    get selectedId() { return this.$.selectedId; }
    get selectedNode() { return this.$.selectedNode; }
    constructor(options) {
        //override
        options.selectedNode = -1;
        options.selectedId = "";
        //options.id = "highlighNode";
        super(options);
        this.g.setAttribute("svg-comp", "h-node");
        this.$.mainNode = tag("circle", "", {
            "svg-type": "node", // "node-x",
            r: this.radius
        });
        this.g.append(this.$.mainNode);
    }
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
        attr(this.$.mainNode, {
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
            let circle = tag("circle", "", {
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
        return extend(super.defaults(), {
            name: "h-node",
            class: "h-node",
            visible: false,
            radius: 5
        });
    }
}
