"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("./dab");
var itemsBase_1 = tslib_1.__importDefault(require("./itemsBase"));
//ItemBoard->Wire
var ItemBoard = /** @class */ (function (_super) {
    tslib_1.__extends(ItemBoard, _super);
    function ItemBoard(container, options) {
        var _this = _super.call(this, options) || this;
        _this.container = container;
        if (!container)
            throw "component without container";
        dab_1.attr(_this.g, {
            id: _this.id,
            "svg-comp": _this.base.type,
        });
        return _this;
        //this still doesn't work to get all overridable properties ¿?
        //properties still cannot access super value
        //(<any>this.settings).__selected = dab.propDescriptor(this, "selected");
    }
    Object.defineProperty(ItemBoard.prototype, "onProp", {
        get: function () { return this.settings.onProp; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemBoard.prototype, "selected", {
        get: function () { return this.settings.selected; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemBoard.prototype, "bonds", {
        get: function () { return this.container.itemBonds(this); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemBoard.prototype, "directional", {
        get: function () { return this.settings.directional; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ItemBoard.prototype, "label", {
        get: function () { return this.settings.label; },
        enumerable: false,
        configurable: true
    });
    ItemBoard.prototype.select = function (value) {
        if (this.selected != value) {
            //set new value
            this.settings.selected = value;
            //add class if selected
            dab_1.condClass(this.g, "selected", this.selected);
            //trigger property changed if applicable
            this.onProp && this.onProp({
                id: "#" + this.id,
                value: this.selected,
                prop: "selected",
                where: 1 //signals it was a change inside the object
            });
        }
        return this;
    };
    ItemBoard.prototype.move = function (x, y) {
        _super.prototype.move.call(this, x, y);
        //trigger property changed if applicable
        this.onProp && this.onProp({
            id: "#" + this.id,
            args: {
                x: this.x,
                y: this.y
            },
            method: 'move',
            where: 1 //signals it was a change inside the object
        });
        return this;
    };
    ItemBoard.prototype.setOnProp = function (value) {
        dab_1.isFn(value) && (this.settings.onProp = value);
        return this;
    };
    ItemBoard.prototype.bond = function (thisNode, ic, icNode) {
        return this.container.bond(this, thisNode, ic, icNode);
    };
    // public bond(thisNode: number, ic: ItemBoard, icNode: number): boolean {
    // 	let
    // 		entry = this.nodeBonds(thisNode);
    // 	if (!ic
    // 		|| (entry && entry.has(ic.id))
    // 		|| !ic.valid(icNode))
    // 		return false;
    // 	if (!entry) {
    // 		//this's the origin of the bond
    // 		(<any>this.settings.bonds)[thisNode] = entry = new Bond(this, ic, icNode, thisNode, true);
    // 	} else if (!entry.add(ic, icNode)) {
    // 		console.log('Oooopsie!')
    // 	}
    // 	this.settings.bondsCount++;
    // 	this.nodeRefresh(thisNode);
    // 	//check this below
    // 	//this's the reverse direction from original bond
    // 	return ic.bond(icNode, this, thisNode);
    // 	//entry = ic.nodeBonds(icNode);
    // 	//return (entry && entry.has(this.id)) ? true : ic.bond(icNode, this, thisNode);
    // }
    ItemBoard.prototype.nodeBonds = function (node) {
        return this.container.nodeBonds(this, node); // <Bond>(<any>this.bonds)[node]
    };
    ItemBoard.prototype.unbond = function (node, id) {
        this.container.unbond(this, node, id);
    };
    ItemBoard.prototype.unbondNode = function (node) {
        this.container.unbondNode(this, node);
    };
    ItemBoard.prototype.disconnect = function () {
        this.container.disconnect(this);
    };
    ItemBoard.prototype.propertyDefaults = function () {
        return dab_1.extend(_super.prototype.propertyDefaults.call(this), {
            selected: false,
            onProp: void 0,
            directional: false,
        });
    };
    return ItemBoard;
}(itemsBase_1.default));
exports.default = ItemBoard;
