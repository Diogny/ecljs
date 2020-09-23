"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var rect_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/rect"));
var interfaces_1 = require("./interfaces");
var bonds_1 = tslib_1.__importDefault(require("./bonds"));
var wire_1 = tslib_1.__importDefault(require("./wire"));
var extra_1 = require("./extra");
var dab_1 = require("dabbjs/dist/lib/dab");
var Container = /** @class */ (function (_super) {
    tslib_1.__extends(Container, _super);
    /**
     * @description creates a library component container
     * @param options configurable options, see below:
     *
     * - store: CompStore;  component store
     */
    function Container(options) {
        var _this = _super.call(this, options) || this;
        //non-configurable properties
        _this.$.counters = {};
        _this.$.components = new Map();
        _this.$.itemMap = new Map();
        _this.$.wireMap = new Map();
        _this.$.selected = [];
        return _this;
    }
    Object.defineProperty(Container.prototype, "selected", {
        get: function () { return this.$.selected; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "items", {
        get: function () { return Array.from(this.$.itemMap.values()).map(function (item) { return item.t; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "wires", {
        get: function () { return Array.from(this.$.wireMap.values()).map(function (item) { return item.t; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "all", {
        get: function () { return this.items.concat(this.wires); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "empty", {
        get: function () { return !(this.$.wireMap.size || this.$.itemMap.size); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "size", {
        get: function () { return this.$.itemMap.size + this.$.wireMap.size; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "store", {
        get: function () { return this.$.store; },
        enumerable: false,
        configurable: true
    });
    /**
     * @description gets the component
     * @param id component's id
     */
    Container.prototype.get = function (id) { var _a; return (_a = extra_1.getItem(this.$, id)) === null || _a === void 0 ? void 0 : _a.t; };
    Container.prototype.defaults = function () {
        return {
            store: void 0,
        };
    };
    Container.prototype.root = function (name) {
        return this.$.components.get(name);
    };
    Container.prototype.hasItem = function (id) { return this.$.itemMap.has(id) || this.$.wireMap.has(id); };
    Container.prototype.selectAll = function (value) {
        return this.$.selected = this.all
            .filter(function (comp) { return (comp.select(value), value); });
    };
    Container.prototype.toggleSelect = function (comp) {
        comp.select(!comp.selected);
        this.$.selected = this.all.filter(function (c) { return c.selected; });
    };
    Container.prototype.selectThis = function (comp) {
        return comp
            && (this.selectAll(false).push(comp.select(true)), true);
    };
    Container.prototype.unselectThis = function (comp) {
        comp.select(false);
        this.$.selected = this.all.filter(function (c) { return c.selected; });
    };
    Container.prototype.selectRect = function (rect) {
        (this.$.selected = this.all.filter(function (item) {
            return rect.intersect(item.rect());
        }))
            .forEach(function (item) { return item.select(true); });
    };
    Container.prototype.deleteSelected = function () {
        var _this = this;
        var deletedCount = 0;
        this.$.selected = this.selected.filter(function (c) {
            if (_this.delete(c)) {
                deletedCount++;
                return false;
            }
            return true;
        });
        return deletedCount;
    };
    Container.prototype.destroy = function () {
        var _this = this;
        this.items.forEach(function (ec) { return _this.delete(ec); });
        this.wires.forEach(function (wire) { return _this.delete(wire); });
        //maps should be empty here
        this.$ = void 0;
    };
    Container.prototype.boundariesRect = function () {
        var array = this.all, first = array.shift(), r = first ? first.rect() : rect_1.default.empty;
        array.forEach(function (ec) { return r = r.add(ec.rect()); });
        return r.grow(20, 20);
    };
    /**
     * @description adds a new component to this container
     * @param options disctionary of options
     */
    Container.prototype.add = function (options) {
        var comp = createBoardItem.call(this, this.$, options);
        // if (comp.type != Type.WIRE && comp.base.library != this.name)
        // 	throw `component incompatible type`;
        return comp;
    };
    /**
     * @description deletes a component from the board, and unbonds all nodes
     * @param comp component
     */
    Container.prototype.delete = function (comp) {
        var _this = this;
        if (comp == undefined)
            return false;
        var list = this.disconnect(comp);
        comp.remove();
        list.forEach(function (id) {
            var nc = _this.get(id);
            nc && (nc.type == interfaces_1.Type.WIRE) && _this.delete(nc);
        });
        return (comp.type == interfaces_1.Type.WIRE) ?
            this.$.wireMap.delete(comp.id) :
            this.$.itemMap.delete(comp.id);
    };
    /**
     * @description gets all bonds of a component
     * @param item component
     */
    Container.prototype.itemBonds = function (item) {
        var _a, _b;
        var bonds = ((_a = this.$.itemMap.get(item.id)) === null || _a === void 0 ? void 0 : _a.b) || ((_b = this.$.wireMap.get(item.id)) === null || _b === void 0 ? void 0 : _b.b);
        //"bonds" cannot be filtered so array node indexes don't get lost
        return bonds;
    };
    /**
     * @description returns the bonds of a node
     * @param item board component
     * @param node 0-based node
     */
    Container.prototype.nodeBonds = function (item, node) {
        var bonds = this.itemBonds(item);
        return bonds && bonds[node];
    };
    /**
     * @description bonds two components two-way
     * @param thisObj start component
     * @param node 0-based node
     * @param ic component to bond to
     * @param icNode component node
     */
    Container.prototype.bond = function (thisObj, thisNode, ic, icNode) {
        if (!this.hasItem(thisObj.id) || !this.hasItem(ic.id))
            return false;
        return this.bondOneWay(thisObj, thisNode, ic, icNode, 0) // from A to B
            && this.bondOneWay(ic, icNode, thisObj, thisNode, 1); // back B to A
    };
    Container.prototype.bondOneWay = function (thisObj, thisNode, ic, icNode, dir) {
        var item = extra_1.getItem(this.$, thisObj.id), entry = item && item.b[thisNode];
        if (!item)
            return false;
        if (!ic
            || (entry && entry.has(ic.id))
            || !ic.valid(icNode))
            return false;
        if (entry) {
            if (!entry.add(ic, icNode))
                throw "duplicated bond";
        }
        else {
            //this's the origin of the bond
            entry = new bonds_1.default(thisObj, thisNode, ic, icNode, dir);
            item.b[thisNode] = entry;
        }
        item.c++;
        thisObj.nodeRefresh(thisNode);
        return true;
    };
    /**
         * @description unbonds a node from a component
         * @param thisObj component to unbond
         * @param node 0-base node to unbond
         * @param id component to unbond from
         */
    Container.prototype.unbond = function (thisObj, node, id) {
        return unbond(this.$, thisObj.id, node, id, true);
    };
    /**
     * @description unbonds a component node
     * @param thisObj component to be unbonded
     * @param node 0-based node
     * @returns undefined if not bonded, otherwise thisObj::Bond.dir and list of disconnected wire ids
     */
    Container.prototype.unbondNode = function (thisObj, node) {
        var item = extra_1.getItem(this.$, thisObj.id), bond = item && item.b[node], link = void 0, list = [];
        if (!bond || !item)
            return;
        //try later to use bond.to.forEach, it was giving an error with wire node selection, think it's fixed
        while (bond.to.length) {
            link = bond.to[0];
            //arbitrarily unbond a node, no matter its direction, so "origin" must be true to go the other way
            unbond(this.$, link.id, link.ndx, thisObj.id, true);
            list.push({ id: link.id, node: link.ndx });
        }
        return { dir: bond.dir, id: thisObj.id, node: node, bonds: list };
    };
    /**
     * @description removes all bonds of a component
     * @param comp component to disconnect
     * @returns list of removed component's id
     */
    Container.prototype.disconnect = function (comp) {
        var list = [];
        for (var node = 0; node < comp.count; node++) {
            var data = this.unbondNode(comp, node);
            data && data.bonds.forEach(function (b) { return list.push(b.id); });
        }
        return list;
    };
    Container.prototype.getAllBonds = function () {
        var bonds = [], keyDict = new Set(), findBonds = function (bond) {
            //always return only the origin Bond
            if (bond.dir === 0) {
                var fromId = bond.from.id, fromNdx = bond.from.ndx, keyRoot_1 = fromId + "," + fromNdx;
                bond.to.forEach(function (b) {
                    var otherRoot = b.id + "," + b.ndx, key0 = keyRoot_1 + "," + otherRoot;
                    if (!keyDict.has(key0)) {
                        keyDict.add(key0).add(otherRoot + "," + keyRoot_1);
                        bonds.push(key0);
                    }
                });
            }
        };
        this.all
            .forEach(function (comp) { var _a; return (_a = comp.bonds) === null || _a === void 0 ? void 0 : _a.forEach(findBonds); });
        return bonds;
    };
    Container.prototype.moveBond = function (id, node, newIndex) {
        var _this = this;
        var item = extra_1.getItem(this.$, id), wire = item === null || item === void 0 ? void 0 : item.t;
        if (!item || !wire || wire.type != interfaces_1.Type.WIRE)
            return;
        var bond = this.nodeBonds(wire, node);
        if (bond) {
            //fix this from index
            bond.from.ndx = newIndex;
            //fix all incoming indexes
            bond.to.forEach(function (bond) {
                var compTo = wire.container.get(bond.id), compToBonds = compTo && _this.nodeBonds(compTo, bond.ndx);
                compToBonds === null || compToBonds === void 0 ? void 0 : compToBonds.to.filter(function (b) { return b.id == wire.id; }).forEach(function (b) {
                    b.ndx = newIndex;
                });
            });
            //move last bond entry
            delete item.b[node];
            item.b[newIndex] = bond;
        }
    };
    return Container;
}(interfaces_1.Base));
exports.default = Container;
/**
 * @description unbonds two components, Comp with Wire, or Two Wires
 * @param container container
 * @param id component id
 * @param node id::node
 * @param toId the component id belonging to id::bonds
 * @param origin true to unbond the other way back
 * @returns BondDir of id Bond is any or undefined for not bonded
 */
function unbond($, id, node, toId, origin) {
    var item = extra_1.getItem($, id), bond = item && item.b[node], b = bond === null || bond === void 0 ? void 0 : bond.remove(toId);
    if (bond && b && item) {
        delete item.b[node];
        (--item.c == 0) && (item.b = []);
        if (origin) {
            unbond($, toId, b.ndx, id, false);
        }
        //return [id] bond direction for reference
        return { dir: bond.dir, id: id, node: node, toId: toId, toNode: b.ndx };
    }
}
function getBaseComp($, name) {
    var that = this, obj = {
        comp: that.store.find(name)
    };
    if (!obj.comp)
        throw new Error("unregistered component: " + name);
    if ((obj.tmpl = obj.comp.meta.nameTmpl)) {
        dab_1.dP(obj, "count", {
            get: function () {
                return $.counters[obj.tmpl];
            },
            set: function (val) {
                $.counters[obj.tmpl] = val;
            }
        });
        isNaN(obj.count) && (obj.count = 0);
    }
    else
        obj.count = 0;
    return obj;
}
/**
 * @description creates a board component
 * @param container container
 * @param options options to create component
 */
function createBoardItem($, options) {
    var that = this, base = void 0, item = void 0, setBase = function () {
        if (!(base = that.root(options.name))) {
            base = getBaseComp.call(that, $, options.name);
            $.components.set(options.name, base);
        }
        options.base = base.comp;
    };
    if (options.id) {
        //this comes from a file read, get id counter
        //get name from id
        var match = (/^([\w-]+)(\d+)$/g).exec(options.id), count = 0;
        if (match == null)
            throw "invalid id: " + options.id;
        //name can't contain numbers at the end,
        //	id = name[count]    nand1	7408IC2	N555IC7	 							doesn't need name
        //		 C[count]	name could be: capacitor, capacitor-polarized, etc.		needs name
        if (!$.counters[match[1]])
            options.name = match[1];
        count = parseInt(match[2]);
        if (count <= 0 || !options.name)
            throw "invalid id: " + options.id;
        setBase();
        //update internal component counter only if count > internal counter
        (count > base.count) && (base.count = count);
    }
    else if (options.name) {
        //this creates a component from option's name
        setBase();
        base.count++;
        if (!base.comp.meta.nameTmpl)
            options.id = "" + options.name + base.count;
        else {
            options.id = "" + base.comp.meta.nameTmpl + base.count;
        }
    }
    else
        throw new Error('invalid component options');
    !options.onProp && (options.onProp = function () {
        //this happens when this component is created...
    });
    if (options.name == "wire") {
        item = new wire_1.default(that, options);
        if ($.wireMap.has(item.id))
            throw new Error('duplicated connector');
        $.wireMap.set(item.id, { t: item, b: [], c: 0 });
    }
    else {
        options.type = base.comp.type;
        item = that.createItem(options);
        if ($.itemMap.has(item.id))
            throw new Error("duplicated component: " + item.id);
        $.itemMap.set(item.id, { t: item, b: [], c: 0 });
    }
    return item;
}
