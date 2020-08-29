"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("dabbjs/dist/lib/dab");
var itemsBase_1 = tslib_1.__importDefault(require("./itemsBase"));
var utils_1 = require("dabbjs/dist/lib/utils");
//ItemBoard->Wire
var ItemBoard = /** @class */ (function (_super) {
    tslib_1.__extends(ItemBoard, _super);
    function ItemBoard(container, options) {
        var _this = _super.call(this, options) || this;
        _this.container = container;
        if (!container)
            throw "missing container";
        //create getter/setters for every property, so type=="size" or "point" don't need to parse always
        //and later save it along the .xml file for custom values
        _this.$.props = dab_1.obj(_this.base.props);
        dab_1.attr(_this.g, {
            id: _this.id,
            "svg-comp": _this.base.type,
        });
        return _this;
        //this still doesn't work to get all overridable properties ¿?
        //properties still cannot access super value
        //(<any>this.$).$elected = dab.propDescriptor(this, "selected");
    }
    Object.defineProperty(ItemBoard.prototype, "onProp", {
        get: function () { return this.$.onProp; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemBoard.prototype, "selected", {
        get: function () { return this.$.selected; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemBoard.prototype, "bonds", {
        get: function () { return this.container.itemBonds(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemBoard.prototype, "dir", {
        get: function () { return this.$.dir; },
        enumerable: false,
        configurable: true
    });
    ItemBoard.prototype.select = function (value) {
        if (this.selected != value) {
            //set new value
            this.$.selected = value;
            //add class if selected, otherwise removes it
            dab_1.tCl(this.g, "selected", this.selected);
            //trigger property changed if applicable
            this.onProp && this.onProp({
                id: "#" + this.id,
                code: 3 // "selected" code: 3
            });
        }
        return this;
    };
    ItemBoard.prototype.move = function (x, y) {
        _super.prototype.move.call(this, x, y);
        //trigger property changed if applicable
        this.onProp && this.onProp({
            id: "#" + this.id,
            code: 2 // "move" code: 2
        });
        return this;
    };
    ItemBoard.prototype.setOnProp = function (value) {
        dab_1.isFn(value) && (this.$.onProp = value);
        return this;
    };
    Object.defineProperty(ItemBoard.prototype, "isHighlighted", {
        /**
         * @description returns true if there's at least one node highlighted.
         */
        get: function () { return this.g.querySelector("circle[svg-type=\"node\"]") != null; },
        enumerable: false,
        configurable: true
    });
    /**
     * @description returns highlighted status of a node, or sets it's status
     * @param node 0-based node
     * @param value undefined: returns Highlighter; true: highlights; false: removes highlight
     * @returns Highlighter for get if exists & set to true; otherwise undefined
     */
    ItemBoard.prototype.highlighted = function (node, value) {
        var circleNode = getNode(this.g, node);
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
            var pin = this.node(node, true), attributes = {
                "svg-type": this.$.hlNode,
                cx: pin.x,
                cy: pin.y,
                r: this.$.hlRadius
            };
            attributes[this.$.hlNode] = node;
            circleNode = utils_1.tag("circle", "", attributes);
            this.g.appendChild(circleNode);
        }
    };
    /**
     * @description show/hide all node highlighted
     * @param value true shows all nodes highlighted, false removes all highlights
     */
    ItemBoard.prototype.highlight = function (value) {
        for (var node = 0, count = this.count; node < count; node++)
            this.highlighted(node, value);
    };
    /**
     * @description removes all highlights except for this node
     * @param node 0-base node
     */
    ItemBoard.prototype.highlightThis = function (node) {
        for (var n = 0, count = this.count; n < count; n++)
            (n != node)
                && this.highlighted(n, false);
    };
    /**
     * @description refreshes the node highlight position, useful for wire node draggings
     * @param node 0-base node
     */
    ItemBoard.prototype.refreshHighlight = function (node) {
        var circleNode = getNode(this.g, node), pin = this.node(node, true);
        if (!circleNode)
            return false;
        dab_1.attr(circleNode, {
            X: pin.x,
            y: pin.y
        });
        return true;
    };
    /**
     * @description bonds two components two-way
     * @param node 0-based node
     * @param ic component to bond to
     * @param icNode component node
     */
    ItemBoard.prototype.bond = function (node, ic, icNode) {
        return this.container.bond(this, node, ic, icNode);
    };
    ItemBoard.prototype.nodeBonds = function (node) {
        return this.container.nodeBonds(this, node); // <Bond>(<any>this.bonds)[node]
    };
    /**
     * @description unbonds a node from a component
     * @param node 0-base node to unbond
     * @param id component to unbond from
     */
    ItemBoard.prototype.unbond = function (node, id) {
        this.container.unbond(this, node, id);
    };
    /**
     * @description unbonds a node
     * @param node 0-base node
     * @returns undefined if invalid node, otherwise list of disconnected wire ids
     */
    ItemBoard.prototype.unbondNode = function (node) {
        return this.container.unbondNode(this, node);
    };
    ItemBoard.prototype.remove = function () {
        this.highlight(false);
        _super.prototype.remove.call(this);
    };
    ItemBoard.prototype.disconnect = function () {
        this.container.disconnect(this);
    };
    ItemBoard.prototype.prop = function (name) {
        return this.$.props[name];
    };
    Object.defineProperty(ItemBoard.prototype, "props", {
        /**
         * @description returns all custom properties of this component
         */
        get: function () { return this.$.props; },
        enumerable: false,
        configurable: true
    });
    ItemBoard.prototype.defaults = function () {
        return dab_1.extend(_super.prototype.defaults.call(this), {
            selected: false,
            onProp: void 0,
            dir: false,
            hlNode: "node",
            hlRadius: 5
        });
    };
    return ItemBoard;
}(itemsBase_1.default));
exports.default = ItemBoard;
function getNode(g, n) {
    return g.querySelector("circle[svg-type=\"node\"][node=\"" + n + "\"]");
}
