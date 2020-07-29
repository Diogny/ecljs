import ItemBase from "./itemsBase";
import { Type } from "./types";
import { extend, attr } from "./dab";
import { tag } from "./utils";
export default class HighlightNode extends ItemBase {
    constructor(options) {
        //override
        options.selectedNode = -1;
        options.selectedId = "";
        options.id = "highlighNode";
        super(options);
        this.g.setAttribute("svg-comp", "h-node");
        this.mainNode = tag("circle", "", {
            "svg-type": "node",
            r: this.radius
        });
        this.g.append(this.mainNode);
    }
    get type() { return Type.HIGHLIGHT; }
    get radius() { return this.settings.radius; }
    get selectedId() { return this.settings.selectedId; }
    get selectedNode() { return this.settings.selectedNode; }
    setRadius(value) {
        this.mainNode.setAttribute("r", (this.settings.radius = value <= 0 ? 5 : value));
        return this;
    }
    hide() {
        this.g.classList.add("hide");
        this.mainNode.classList.remove("hide");
        this.g.innerHTML = "";
        this.g.append(this.mainNode);
        return this;
    }
    show(x, y, id, node) {
        this.move(x, y);
        attr(this.mainNode, {
            cx: this.x,
            cy: this.y,
            //"node-x": <any>node,
            "node": (this.settings.selectedNode = node)
        });
        this.settings.selectedId = id;
        this.g.classList.remove("hide");
        return this;
    }
    showConnections(nodes) {
        this.mainNode.classList.add("hide");
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
    propertyDefaults() {
        return extend(super.propertyDefaults(), {
            name: "h-node",
            class: "h-node",
            visible: false,
            radius: 5
        });
    }
}
