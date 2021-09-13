"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dab_1 = require("dabbjs/dist/lib/dab");
const misc_1 = require("dabbjs/dist/lib/misc");
const dom_1 = require("dabbjs/dist/lib/dom");
const itemsBase_1 = (0, tslib_1.__importDefault)(require("./itemsBase"));
//ItemBoard->Wire
class ItemBoard extends itemsBase_1.default {
    constructor(container, options) {
        super(options);
        this.container = container;
        if (!container)
            throw new Error(`missing container`);
        //create getter/setters for every property, so type=="size" or "point" don't need to parse always
        //and later save it along the .xml file for custom values
        this.$.props = (0, dab_1.obj)(this.base.props);
        (0, dom_1.attr)(this.g, {
            id: this.id,
            "svg-comp": this.base.type,
        });
        this.g.innerHTML = this.base.data;
        //this still doesn't work to get all overridable properties ¿?
        //properties still cannot access super value
        //(<any>this.$).$elected = dab.propDescriptor(this, "selected");
    }
    get onProp() { return this.$.onProp; }
    get selected() { return this.$.selected; }
    get bonds() { return this.container.itemBonds(this); }
    get dir() { return this.$.dir; }
    select(value) {
        if (this.selected != value) {
            //set new value
            this.$.selected = value;
            //add class if selected, otherwise removes it
            (0, dom_1.tCl)(this.g, "selected", this.selected);
            //trigger property changed if applicable
            this.onProp && this.onProp({
                id: `#${this.id}`,
                code: 3 // "selected" code: 3
            });
        }
        return this;
    }
    valid(node) { return node >= 0 && node < this.count; }
    //this returns true for an EC, and any Wire node and that it is not a start|end bonded node
    highlightable(node) { return this.valid(node); }
    move(x, y) {
        super.move(x, y);
        //trigger property changed if applicable
        this.onProp && this.onProp({
            id: `#${this.id}`,
            code: 2 // "move" code: 2
        });
        return this.refresh();
    }
    /**
     * @description detects a point over a node
     * @param p point to check for component node
     * @param _ln 1-based line number, for EC it's discarded
     */
    over(p, _ln) {
        for (let i = 0, len = this.count; i < len; i++) {
            let node = this.node(i);
            //radius 5 =>  5^2 = 25
            if ((Math.pow((p.x) - node.x, 2) + Math.pow((p.y) - node.y, 2)) <= ItemBoard.nodeArea)
                return i;
        }
        return -1;
    }
    /**
     * @description refreshes all bonded components to this node
     * @param node 0-base node
     */
    nodeRefresh(node) {
        let bond = this.container.nodeBonds(this, node), p = this.node(node);
        p && bond && bond.to.forEach((d) => {
            let ic = this.container.get(d.id);
            ic && ic.setNode(d.ndx, p);
        });
        return this;
    }
    /**
     * @description sets node new location. Only works for Wire
     * @param _node 0-base node
     * @param _p new location
     */
    setNode(_node, _p) { return this; }
    setOnProp(value) {
        (0, dab_1.isFn)(value) && (this.$.onProp = value);
        return this;
    }
    /**
     * @description returns true if there's at least one node highlighted.
     */
    get isHighlighted() { return this.g.querySelector(`circle[svg-type="node"]`) != null; }
    /**
     * @description returns highlighted status of a node, or sets it's status
     * @param node 0-based node
     * @param value undefined: returns Highlighter; true: highlights; false: removes highlight
     * @returns Highlighter for get if exists & set to true; otherwise undefined
     */
    highlighted(node, value) {
        let circleNode = getNode(this.g, node);
        if (value === undefined) {
            return circleNode != null;
        }
        if (value === false) {
            //remove if exists, otherwise do nothing, it doesn't exists
            circleNode && this.g.removeChild(circleNode);
        }
        else {
            if (!this.highlightable(node) || circleNode)
                return false;
            //value == true, and it doesn't exists, create and return
            //some bug, it's not deleted
            let pin = this.node(node, true), attributes = {
                "svg-type": this.$.hlNode,
                cx: pin.x,
                cy: pin.y,
                r: this.$.hlRadius
            };
            attributes[this.$.hlNode] = node;
            circleNode = (0, dom_1.tag)("circle", "", attributes);
            this.g.appendChild(circleNode);
        }
        return;
    }
    /**
     * @description show/hide all node highlighted
     * @param value true shows all nodes highlighted, false removes all highlights
     */
    highlight(value) {
        for (let node = 0, count = this.count; node < count; node++)
            this.highlighted(node, value);
    }
    /**
     * @description removes all highlights except for this node
     * @param node 0-base node
     */
    highlightThis(node) {
        for (let n = 0, count = this.count; n < count; n++)
            (n != node)
                && this.highlighted(n, false);
    }
    /**
     * @description refreshes the node highlight position, useful for wire node draggings
     * @param node 0-base node
     */
    refreshHighlight(node) {
        let circleNode = getNode(this.g, node), pin = this.node(node, true);
        if (!circleNode)
            return false;
        (0, dom_1.attr)(circleNode, {
            cx: pin.x,
            cy: pin.y,
        });
        return true;
    }
    /**
     * removes this board component from then board
     */
    remove() {
        this.highlight(false);
        super.remove();
    }
    prop(name) {
        return this.$.props[name];
    }
    /**
     * @description returns all custom properties of this component
     */
    get props() { return this.$.props; }
    defaults() {
        return (0, misc_1.extend)(super.defaults(), {
            selected: false,
            onProp: void 0,
            dir: false,
            hlNode: "node",
            hlRadius: 5
        });
    }
}
exports.default = ItemBoard;
ItemBoard.nodeArea = 81;
function getNode(g, n) {
    return g.querySelector(`circle[svg-type="node"][node="${n}"]`);
}
//# sourceMappingURL=itemsBoard.js.map