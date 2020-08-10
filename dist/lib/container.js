"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var dab_1 = require("./dab");
var rect_1 = tslib_1.__importDefault(require("./rect"));
var bonds_1 = tslib_1.__importDefault(require("./bonds"));
var wire_1 = tslib_1.__importDefault(require("./wire"));
var components_1 = tslib_1.__importDefault(require("./components"));
var Container = /** @class */ (function (_super) {
    tslib_1.__extends(Container, _super);
    function Container(name) {
        return _super.call(this, {
            name: name
        }) || this;
    }
    Object.defineProperty(Container.prototype, "name", {
        get: function () { return this.__s.name; },
        set: function (value) {
            this.__s.name = value;
            this.modified = true;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "board", {
        get: function () { return this.__s.board; },
        set: function (board) {
            this.__s.board = board;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "counters", {
        get: function () { return this.__s.counters; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "components", {
        get: function () { return this.__s.components; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "itemMap", {
        get: function () { return this.__s.itemMap; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "wireMap", {
        get: function () { return this.__s.wireMap; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "selected", {
        get: function () { return this.__s.selected; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "items", {
        get: function () { return Array.from(this.itemMap.values()).map(function (item) { return item.t; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "wires", {
        get: function () { return Array.from(this.wireMap.values()).map(function (item) { return item.t; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "all", {
        get: function () { return this.items.concat(this.wires); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "empty", {
        get: function () { return !(this.wireMap.size || this.itemMap.size); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "size", {
        get: function () { return this.itemMap.size + this.wireMap.size; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "registered", {
        get: function () { return this.board != undefined; },
        enumerable: false,
        configurable: true
    });
    Container.prototype.get = function (id) {
        var _a, _b;
        return ((_a = this.itemMap.get(id)) === null || _a === void 0 ? void 0 : _a.t) || ((_b = this.wireMap.get(id)) === null || _b === void 0 ? void 0 : _b.t);
    };
    Object.defineProperty(Container.prototype, "modified", {
        get: function () { return this.__s.modified; },
        set: function (value) {
            if (value == this.modified)
                return;
            this.__s.modified = value;
            this.registered && (this.board.modified = true);
        },
        enumerable: false,
        configurable: true
    });
    Container.prototype.defaults = function () {
        return {
            name: "",
            board: void 0,
            counters: {},
            components: new Map(),
            itemMap: new Map(),
            wireMap: new Map(),
            selected: [],
            modified: false,
        };
    };
    Container.prototype.root = function (name) {
        return this.components.get(name);
    };
    Container.prototype.hasComponent = function (id) { return this.itemMap.has(id) || this.wireMap.has(id); };
    Container.prototype.selectAll = function (value) {
        return this.__s.selected = this.all
            .filter(function (comp) { return (comp.select(value), value); });
    };
    Container.prototype.toggleSelect = function (comp) {
        comp.select(!comp.selected);
        this.__s.selected = this.all.filter(function (c) { return c.selected; });
    };
    Container.prototype.selectThis = function (comp) {
        return comp
            && (this.selectAll(false).push(comp.select(true)), true);
    };
    Container.prototype.unselectThis = function (comp) {
        comp.select(false);
        this.__s.selected = this.all.filter(function (c) { return c.selected; });
    };
    Container.prototype.selectRect = function (rect) {
        (this.__s.selected = this.all.filter(function (item) {
            return rect.intersect(item.rect());
        }))
            .forEach(function (item) { return item.select(true); });
    };
    Container.prototype.deleteSelected = function () {
        var _this = this;
        var deletedCount = 0;
        this.__s.selected = this.selected.filter(function (c) {
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
        this.__s = void 0;
    };
    Container.prototype.boundariesRect = function () {
        var array = this.all, first = array.shift(), r = first ? first.rect() : rect_1.default.empty();
        array.forEach(function (ec) { return r.add(ec.rect()); });
        r.grow(20, 20);
        return r;
    };
    Container.prototype.add = function (options) {
        var comp = createBoardItem(this, options);
        if (comp.type != interfaces_1.Type.WIRE && comp.base.library != this.library)
            throw "component incompatible type";
        this.modified = true;
        return comp;
    };
    Container.prototype.delete = function (comp) {
        if (comp == undefined)
            return false;
        comp.disconnect();
        comp.remove();
        this.modified = true;
        return (comp.type == interfaces_1.Type.WIRE) ?
            this.wireMap.delete(comp.id) :
            this.itemMap.delete(comp.id);
    };
    Container.prototype.itemBonds = function (item) {
        var _a, _b;
        var bonds = ((_a = this.itemMap.get(item.id)) === null || _a === void 0 ? void 0 : _a.b) || ((_b = this.wireMap.get(item.id)) === null || _b === void 0 ? void 0 : _b.b);
        //"bonds" cannot be filtered so array node indexes don't get lost
        return bonds;
    };
    Container.prototype.nodeBonds = function (item, node) {
        var bonds = this.itemBonds(item);
        return bonds && bonds[node];
    };
    Container.prototype.bond = function (thisObj, thisNode, ic, icNode) {
        if (!this.hasComponent(thisObj.id) || !this.hasComponent(ic.id))
            return false;
        return this.bondSingle(thisObj, thisNode, ic, icNode, true)
            && this.bondSingle(ic, icNode, thisObj, thisNode, false)
            && (this.modified = true);
    };
    Container.prototype.bondSingle = function (thisObj, thisNode, ic, icNode, origin) {
        var item = getItem(this, thisObj.id), entry = item && item.b[thisNode];
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
            entry = new bonds_1.default(thisObj, thisNode, ic, icNode, origin);
            item.b[thisNode] = entry;
        }
        item.c++;
        thisObj.nodeRefresh(thisNode);
        return true;
    };
    Container.prototype.unbond = function (thisObj, node, id) {
        unbond(this, thisObj.id, node, id, true);
    };
    Container.prototype.unbondNode = function (thisObj, node) {
        var item = getItem(this, thisObj.id), bond = item && item.b[node], link = void 0;
        if (!bond || !item)
            return;
        //try later to use bond.to.forEach, it was giving an error with wire node selection, think it's fixed
        while (bond.to.length) {
            link = bond.to[0];
            unbond(this, link.id, link.ndx, thisObj.id, true);
        }
    };
    Container.prototype.disconnect = function (thisObj) {
        for (var node = 0; node < thisObj.count; node++)
            this.unbondNode(thisObj, node);
    };
    Container.prototype.getAllBonds = function () {
        var bonds = [], keyDict = new Set(), findBonds = function (bond) {
            var fromId = bond.from.id, fromNdx = bond.from.ndx, keyRoot = fromId + "," + fromNdx;
            bond.to.forEach(function (b) {
                var otherRoot = b.id + "," + b.ndx, key0 = keyRoot + "," + otherRoot;
                if (!keyDict.has(key0)) {
                    keyDict.add(key0).add(otherRoot + "," + keyRoot);
                    bonds.push(key0);
                }
            });
        };
        this.all
            .forEach(function (comp) { var _a; return (_a = comp.bonds) === null || _a === void 0 ? void 0 : _a.forEach(findBonds); });
        return bonds;
    };
    Container.prototype.moveBond = function (id, node, newIndex) {
        var item = getItem(this, id), wire = item === null || item === void 0 ? void 0 : item.t;
        if (!item || !wire || wire.type != interfaces_1.Type.WIRE)
            return;
        var bond = wire.nodeBonds(node);
        if (bond) {
            //fix this from index
            bond.from.ndx = newIndex;
            //fix all incoming indexes
            bond.to.forEach(function (bond) {
                var compTo = wire.container.get(bond.id), compToBonds = compTo === null || compTo === void 0 ? void 0 : compTo.nodeBonds(bond.ndx);
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
function unbond(container, id, node, toId, origin) {
    var item = getItem(container, id), bond = item && item.b[node], b = bond === null || bond === void 0 ? void 0 : bond.remove(toId);
    if (bond && b && item) {
        delete item.b[node];
        (--item.c == 0) && (item.b = []);
        if (origin) {
            unbond(container, toId, b.ndx, id, false);
        }
        container.modified = true;
    }
}
function getItem(container, id) {
    return container.itemMap.get(id) || container.wireMap.get(id);
}
function createBoardItem(container, options) {
    var regex = /(?:{([^}]+?)})+/g, name = options.name || "", base = container.root(name), newComp = !base, item = void 0;
    !base && (base = {
        comp: components_1.default.find(name),
        count: 0
    });
    if (!base.comp)
        throw "unregistered component: " + name;
    newComp
        && (base.count = base.comp.meta.countStart | 0, container.components.set(name, base));
    options.base = base.comp;
    if (!options.id) {
        options.id = name + "-" + base.count;
    }
    var label = base.comp.meta.nameTmpl.replace(regex, function (match, group) {
        var arr = group.split('.'), getRoot = function (name) {
            //valid entry points
            switch (name) {
                case "base": return base;
                case "Container": return container.counters;
            }
        }, rootName = arr.shift() || "", rootRef = getRoot(rootName), prop = arr.pop(), isUniqueCounter = function () { return rootName == "Container"; }, result;
        while (rootRef && arr.length)
            rootRef = rootRef[arr.shift()];
        if (rootRef == undefined
            || ((result = rootRef[prop]) == undefined
                && (!isUniqueCounter()
                    || (result = rootRef[prop] = base.comp.meta.countStart | 0, false))))
            throw "invalid label template";
        isUniqueCounter()
            && dab_1.isNum(result)
            && (rootRef[prop] = result + 1);
        return result;
    });
    if (options.label && label != options.label)
        throw "invalid label";
    else
        options.label = label;
    base.count++;
    !options.onProp && (options.onProp = function () {
        //this happens when this component is created...
    });
    if (name == "wire") {
        item = new wire_1.default(container, options);
        if (container.wireMap.has(item.id))
            throw "duplicated connector";
        container.wireMap.set(item.id, { t: item, b: [], c: 0 });
    }
    else {
        options.type = base.comp.type;
        item = container.createItem(options);
        if (container.itemMap.has(item.id))
            throw "duplicated component: " + item.id;
        container.itemMap.set(item.id, { t: item, b: [], c: 0 });
    }
    return item;
}
