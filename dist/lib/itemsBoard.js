"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("./dab");
var itemsBase_1 = tslib_1.__importDefault(require("./itemsBase"));
var compNode_1 = tslib_1.__importDefault(require("./compNode"));
//ItemBoard->Wire
var ItemBoard = /** @class */ (function (_super) {
    tslib_1.__extends(ItemBoard, _super);
    function ItemBoard(container, options) {
        var _this = _super.call(this, options) || this;
        _this.container = container;
        if (!container)
            throw "missing container";
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
         * @description returns true if there's at least one node highlighted
         */
        get: function () { return this.$.highlights["length"] != 0; },
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
        //get part
        if (value === undefined) {
            return this.$.highlights[node];
        }
        //set part
        var hl = this.$.highlights[node];
        if (value === false) {
            //remove if exists, otherwise do nothing, it doesn't exists
            if (hl) {
                var svg = this.g.removeChild(hl.g);
                delete this.$.highlights[node];
                this.$.highlights["length"]--;
                return;
            }
        }
        else {
            if (!this.highlightable(node))
                return;
            //value == true, and it doesn't exists, create and return
            //some bug, it's not deleted
            var pin = this.node(node, true), exists = hl != undefined;
            hl = new compNode_1.default({
                node: node,
                x: pin.x,
                y: pin.y,
                label: pin.label
            });
            this.g.appendChild(hl.g);
            this.$.highlights[node] = hl;
            !exists && this.$.highlights["length"]++;
        }
    };
    /**
     * @description show/hide all node highlighted
     * @param value true shows all nodes highlighted, false removes all highlights
     */
    ItemBoard.prototype.highlight = function (value) {
        //setting to false with no highlights shortcut
        //if (!value && !this.isHighlighted)
        //	return;
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
        var hl = this.highlighted(node);
        if (hl) {
            var pin = this.node(node, true);
            //only changes x,y
            hl.move(pin.x, pin.y);
            return true;
        }
        return false;
    };
    ItemBoard.prototype.bond = function (thisNode, ic, icNode) {
        return this.container.bond(this, thisNode, ic, icNode);
    };
    ItemBoard.prototype.nodeBonds = function (node) {
        return this.container.nodeBonds(this, node); // <Bond>(<any>this.bonds)[node]
    };
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
            highlights: { length: 0 }
        });
    };
    return ItemBoard;
}(itemsBase_1.default));
exports.default = ItemBoard;
