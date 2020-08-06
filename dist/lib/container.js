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
    function Container() {
        return _super.call(this, {}) || this;
    }
    Object.defineProperty(Container.prototype, "uniqueCounters", {
        get: function () { return this.settings.uniqueCounters; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "componentTemplates", {
        get: function () { return this.settings.componentTemplates; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "itemMap", {
        get: function () { return this.settings.itemMap; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "wireMap", {
        get: function () { return this.settings.wireMap; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "selected", {
        get: function () { return this.settings.selected; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "components", {
        get: function () { return Array.from(this.itemMap.values()).map(function (item) { return item.c; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "wires", {
        get: function () { return Array.from(this.wireMap.values()).map(function (item) { return item.c; }); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Container.prototype, "all", {
        get: function () { return this.components.concat(this.wires); },
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
    Container.prototype.get = function (id) {
        var _a, _b;
        return ((_a = this.itemMap.get(id)) === null || _a === void 0 ? void 0 : _a.c) || ((_b = this.wireMap.get(id)) === null || _b === void 0 ? void 0 : _b.c);
    };
    Object.defineProperty(Container.prototype, "modified", {
        get: function () { return this.settings.modified; },
        set: function (value) {
            if (value == this.modified)
                return;
            this.settings.modified = value;
        },
        enumerable: false,
        configurable: true
    });
    Container.prototype.propertyDefaults = function () {
        return {
            uniqueCounters: {},
            componentTemplates: new Map(),
            itemMap: new Map(),
            wireMap: new Map(),
            selected: [],
            modified: false,
        };
    };
    Container.prototype.rootComponent = function (name) {
        return this.componentTemplates.get(name);
    };
    Container.prototype.hasComponent = function (id) { return this.itemMap.has(id) || this.wireMap.has(id); };
    Container.prototype.selectAll = function (value) {
        return this.settings.selected = Array.from(this.itemMap.values())
            .filter(function (comp) { return (comp.c.select(value), value); })
            .map(function (item) { return item.c; });
    };
    Container.prototype.toggleSelect = function (comp) {
        comp.select(!comp.selected);
        this.settings.selected =
            this.components.filter(function (c) { return c.selected; });
    };
    Container.prototype.selectThis = function (comp) {
        return comp
            && (this.selectAll(false).push(comp.select(true)), true);
    };
    Container.prototype.unselectThis = function (comp) {
        comp.select(false);
        this.settings.selected =
            this.components.filter(function (c) { return c.selected; });
    };
    Container.prototype.selectRect = function (rect) {
        (this.settings.selected =
            this.components.filter(function (item) {
                return rect.intersect(item.rect());
            }))
            .forEach(function (item) { return item.select(true); });
    };
    Container.prototype.deleteSelected = function () {
        var _this = this;
        var deletedCount = 0;
        this.settings.selected =
            this.selected.filter(function (c) {
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
        this.components.forEach(function (ec) { return _this.delete(ec); });
        this.wires.forEach(function (wire) { return _this.delete(wire); });
        //maps should be empty here
        this.settings = void 0;
    };
    Container.prototype.boundariesRect = function () {
        var array = this.all, first = array.shift(), r = first ? first.rect() : rect_1.default.empty();
        array.forEach(function (ec) { return r.add(ec.rect()); });
        r.grow(20, 20);
        return r;
    };
    Container.prototype.add = function (options) {
        var comp;
        ((options.name == "wire")
            && (options.points = options.points, true))
            || (options.x = options.x, options.y = options.y);
        comp = createBoardItem(this, options);
        if (comp.type != interfaces_1.Type.WIRE && comp.base.library != this.library)
            throw "component incompatible type";
        this.modified = true;
        return comp;
    };
    Container.prototype.delete = function (comp) {
        if (comp.type == interfaces_1.Type.WIRE ?
            this.wireMap.delete(comp.id) :
            this.itemMap.delete(comp.id)) {
            comp.disconnect();
            comp.remove();
            this.modified = true;
            return true;
        }
        return false;
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
            && this.bondSingle(ic, icNode, thisObj, thisNode, false);
    };
    Container.prototype.bondSingle = function (thisObj, thisNode, ic, icNode, origin) {
        var item = getItem(this, thisObj.id), entry = item && item.b[thisNode]; // this.nodeBonds(thisObj, thisNode);
        if (!item)
            return false;
        if (!ic
            || (entry && entry.has(ic.id))
            || !ic.valid(icNode))
            return false;
        if (entry) {
            if (!entry.add(ic, icNode)) {
                console.log('Oooopsie!');
            }
        }
        else {
            //this's the origin of the bond
            entry = new bonds_1.default(thisObj, thisNode, ic, icNode, origin);
            item.b[thisNode] = entry;
        }
        thisObj.nodeRefresh(thisNode);
        return true;
    };
    Container.prototype.unbond = function (thisObj, node, id) {
        var item = getItem(this, thisObj.id), bond = item && item.b[node], //this.nodeBonds(node),
        b = bond === null || bond === void 0 ? void 0 : bond.remove(id);
        if (bond && b && item) {
            if (bond.count == 0) {
                delete item.b[node];
                //(--this.settings.bondsCount == 0) && (this.settings.bonds = []);
            }
            thisObj.nodeRefresh(node);
            var ic = this.get(id);
            ic && ic.unbond(b.ndx, thisObj.id);
        }
    };
    Container.prototype.unbondNode = function (thisObj, node) {
        var _a;
        var item = getItem(this, thisObj.id), bond = item && item.b[node], link = void 0;
        if (!bond)
            return;
        //try later to use bond.to.forEach, it was giving an error with wire node selection, think it's fixed
        for (var i = 0, len = bond.to.length; i < len; i++) {
            link = bond.to[i];
            (_a = this.get(link.id)) === null || _a === void 0 ? void 0 : _a.unbond(link.ndx, bond.from.id);
        }
        item === null || item === void 0 ? true : delete item.b[node];
        //(--this.settings.bondsCount == 0) && (this.settings.bonds = []);
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
    return Container;
}(interfaces_1.BaseSettings));
exports.default = Container;
function getItem(container, id) {
    return container.itemMap.get(id) || container.wireMap.get(id);
}
function createBoardItem(container, options) {
    var regex = /(?:{([^}]+?)})+/g, name = (options === null || options === void 0 ? void 0 : options.name) || "", base = container.rootComponent(name), newComp = !base, item = void 0;
    !base && (base = {
        comp: components_1.default.find(name),
        count: 0
    });
    if (!base.comp)
        throw "unregistered component: " + name;
    newComp
        && (base.count = base.comp.meta.countStart | 0, container.componentTemplates.set(name, base));
    options.base = base.comp;
    if (!options.id) {
        options.id = name + "-" + base.count;
    }
    var label = base.comp.meta.nameTmpl.replace(regex, function (match, group) {
        var arr = group.split('.'), getRoot = function (name) {
            //valid entry points
            switch (name) {
                case "base": return base;
                case "Container": return container.uniqueCounters;
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
        container.wireMap.set(item.id, { c: item, b: [] });
    }
    else {
        options.type = base.comp.type;
        item = container.createItem(options);
        if (container.itemMap.has(item.id))
            throw "duplicated component: " + item.id;
        container.itemMap.set(item.id, { c: item, b: [] });
    }
    return item;
}
