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
    Object.defineProperty(ItemBoard.prototype, "highlights", {
        get: function () { return this.$.highlights; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemBoard.prototype, "highlighted", {
        get: function () { return this.$.highlights.length != 0; },
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
    /**
     * @description highlights a node, or keeps highlighting more nodes
     * @param node 0-base node to be highlighted
     * @param multiple false is default, so it highlights only this node, true is multiple highlighted nodes
     */
    ItemBoard.prototype.highlightNode = function (node, multiple) {
        return highlightNode(this, this.$, node, multiple);
    };
    /**
     * @description show/hide all node highlighted
     * @param value true shows all nodes highlighted, false removes all highlights
     */
    ItemBoard.prototype.highlight = function (value) {
        if (value && this.highlights.length == this.count)
            //already set
            return;
        //remove highlights if any
        clear(this, this.$);
        if (value) {
            for (var node = 0; node < this.count; node++)
                highlightNode(this, this.$, node, true, true);
        }
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
        clear(this, this.$);
        _super.prototype.remove.call(this);
    };
    ItemBoard.prototype.disconnect = function () {
        this.container.disconnect(this);
    };
    ItemBoard.prototype.prop = function (propName) {
        return this.$.props[propName];
    };
    ItemBoard.prototype.defaults = function () {
        return dab_1.extend(_super.prototype.defaults.call(this), {
            selected: false,
            onProp: void 0,
            dir: false,
            highlights: []
        });
    };
    return ItemBoard;
}(itemsBase_1.default));
exports.default = ItemBoard;
function clear(that, $) {
    $.highlights = $.highlights.filter(function (hl) { return (that.g.removeChild(hl.g), false); });
}
function highlightNode(that, $, node, multiple, noCheck) {
    var pin = that.getNode(node, true);
    if (!pin)
        return;
    if (!that.hghlightable(node))
        return false;
    if (multiple) {
        //avoid calling this for every node when doing a full internal highlight
        if (!noCheck && $.highlights.some(function (hl) { return hl.node == node; }))
            return false;
    }
    else
        clear(that, $);
    var hl = new compNode_1.default({
        node: node,
        x: pin.x,
        y: pin.y,
        label: pin.label
    });
    that.g.appendChild(hl.g);
    (!multiple && ($.highlights = [hl], true)) || $.highlights.push(hl);
    return true;
}
