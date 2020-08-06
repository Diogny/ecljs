"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const interfaces_1 = require("./interfaces");
const dab_1 = require("./dab");
const rect_1 = tslib_1.__importDefault(require("./rect"));
const bonds_1 = tslib_1.__importDefault(require("./bonds"));
const wire_1 = tslib_1.__importDefault(require("./wire"));
const components_1 = tslib_1.__importDefault(require("./components"));
class Container extends interfaces_1.BaseSettings {
    constructor() {
        super({});
    }
    get uniqueCounters() { return this.settings.uniqueCounters; }
    get componentTemplates() { return this.settings.componentTemplates; }
    get itemMap() { return this.settings.itemMap; }
    get wireMap() { return this.settings.wireMap; }
    get selected() { return this.settings.selected; }
    get components() { return Array.from(this.itemMap.values()).map(item => item.c); }
    get wires() { return Array.from(this.wireMap.values()).map(item => item.c); }
    get all() { return this.components.concat(this.wires); }
    get empty() { return !(this.wireMap.size || this.itemMap.size); }
    get size() { return this.itemMap.size + this.wireMap.size; }
    get(id) {
        var _a, _b;
        return ((_a = this.itemMap.get(id)) === null || _a === void 0 ? void 0 : _a.c) || ((_b = this.wireMap.get(id)) === null || _b === void 0 ? void 0 : _b.c);
    }
    get modified() { return this.settings.modified; }
    set modified(value) {
        if (value == this.modified)
            return;
        this.settings.modified = value;
    }
    propertyDefaults() {
        return {
            uniqueCounters: {},
            componentTemplates: new Map(),
            itemMap: new Map(),
            wireMap: new Map(),
            selected: [],
            modified: false,
        };
    }
    rootComponent(name) {
        return this.componentTemplates.get(name);
    }
    hasComponent(id) { return this.itemMap.has(id) || this.wireMap.has(id); }
    selectAll(value) {
        return this.settings.selected = Array.from(this.itemMap.values())
            .filter(comp => (comp.c.select(value), value))
            .map(item => item.c);
    }
    toggleSelect(comp) {
        comp.select(!comp.selected);
        this.settings.selected =
            this.components.filter(c => c.selected);
    }
    selectThis(comp) {
        return comp
            && (this.selectAll(false).push(comp.select(true)), true);
    }
    unselectThis(comp) {
        comp.select(false);
        this.settings.selected =
            this.components.filter(c => c.selected);
    }
    selectRect(rect) {
        (this.settings.selected =
            this.components.filter((item) => {
                return rect.intersect(item.rect());
            }))
            .forEach(item => item.select(true));
    }
    deleteSelected() {
        let deletedCount = 0;
        this.settings.selected =
            this.selected.filter((c) => {
                if (this.delete(c)) {
                    deletedCount++;
                    return false;
                }
                return true;
            });
        return deletedCount;
    }
    destroy() {
        this.components.forEach(ec => this.delete(ec));
        this.wires.forEach(wire => this.delete(wire));
        //maps should be empty here
        this.settings = void 0;
    }
    boundariesRect() {
        let array = this.all, first = array.shift(), r = first ? first.rect() : rect_1.default.empty();
        array.forEach(ec => r.add(ec.rect()));
        r.grow(20, 20);
        return r;
    }
    add(options) {
        let comp;
        ((options.name == "wire")
            && (options.points = options.points, true))
            || (options.x = options.x, options.y = options.y);
        comp = createBoardItem(this, options);
        if (comp.type != interfaces_1.Type.WIRE && comp.base.library != this.library)
            throw `component incompatible type`;
        this.modified = true;
        return comp;
    }
    delete(comp) {
        if (comp.type == interfaces_1.Type.WIRE ?
            this.wireMap.delete(comp.id) :
            this.itemMap.delete(comp.id)) {
            comp.disconnect();
            comp.remove();
            this.modified = true;
            return true;
        }
        return false;
    }
    itemBonds(item) {
        var _a, _b;
        let bonds = ((_a = this.itemMap.get(item.id)) === null || _a === void 0 ? void 0 : _a.b) || ((_b = this.wireMap.get(item.id)) === null || _b === void 0 ? void 0 : _b.b);
        return bonds && bonds.filter(b => b != undefined);
    }
    nodeBonds(item, node) {
        let bonds = this.itemBonds(item);
        return bonds && bonds[node];
    }
    bond(thisObj, thisNode, ic, icNode) {
        if (!this.hasComponent(thisObj.id) || !this.hasComponent(ic.id))
            return false;
        return this.bondSingle(thisObj, thisNode, ic, icNode, true)
            && this.bondSingle(ic, icNode, thisObj, thisNode, false);
    }
    bondSingle(thisObj, thisNode, ic, icNode, origin) {
        let item = getItem(this, thisObj.id), entry = item && item.b[thisNode]; // this.nodeBonds(thisObj, thisNode);
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
    }
    unbond(thisObj, node, id) {
        let item = getItem(this, thisObj.id), bond = item && item.b[node], //this.nodeBonds(node),
        b = bond === null || bond === void 0 ? void 0 : bond.remove(id);
        if (bond && b && item) {
            if (bond.count == 0) {
                delete item.b[node];
                //(--this.settings.bondsCount == 0) && (this.settings.bonds = []);
            }
            thisObj.nodeRefresh(node);
            let ic = this.get(id);
            ic && ic.unbond(b.ndx, thisObj.id);
        }
    }
    unbondNode(thisObj, node) {
        var _a;
        let item = getItem(this, thisObj.id), bond = item && item.b[node], link = void 0;
        if (!bond)
            return;
        //try later to use bond.to.forEach, it was giving an error with wire node selection, think it's fixed
        for (let i = 0, len = bond.to.length; i < len; i++) {
            link = bond.to[i];
            (_a = this.get(link.id)) === null || _a === void 0 ? void 0 : _a.unbond(link.ndx, bond.from.id);
        }
        item === null || item === void 0 ? true : delete item.b[node];
        //(--this.settings.bondsCount == 0) && (this.settings.bonds = []);
    }
    disconnect(thisObj) {
        for (let node = 0; node < thisObj.count; node++)
            this.unbondNode(thisObj, node);
    }
    getAllBonds() {
        let bonds = [], keyDict = new Set(), findBonds = (bond) => {
            let fromId = bond.from.id, fromNdx = bond.from.ndx, keyRoot = `${fromId},${fromNdx}`;
            bond.to.forEach(b => {
                let otherRoot = `${b.id},${b.ndx}`, key0 = `${keyRoot},${otherRoot}`;
                if (!keyDict.has(key0)) {
                    keyDict.add(key0).add(`${otherRoot},${keyRoot}`);
                    bonds.push(key0);
                }
            });
        };
        this.all
            .forEach(comp => { var _a; return (_a = comp.bonds) === null || _a === void 0 ? void 0 : _a.forEach(findBonds); });
        return bonds;
    }
}
exports.default = Container;
function getItem(container, id) {
    return container.itemMap.get(id) || container.wireMap.get(id);
}
function createBoardItem(container, options) {
    let regex = /(?:{([^}]+?)})+/g, name = (options === null || options === void 0 ? void 0 : options.name) || "", base = container.rootComponent(name), newComp = !base, item = void 0;
    !base && (base = {
        comp: components_1.default.find(name),
        count: 0
    });
    if (!base.comp)
        throw `unregistered component: ${name}`;
    newComp
        && (base.count = base.comp.meta.countStart | 0, container.componentTemplates.set(name, base));
    options.base = base.comp;
    if (!options.id) {
        options.id = `${name}-${base.count}`;
    }
    let label = base.comp.meta.nameTmpl.replace(regex, function (match, group) {
        let arr = group.split('.'), getRoot = (name) => {
            //valid entry points
            switch (name) {
                case "base": return base;
                case "Container": return container.uniqueCounters;
            }
        }, rootName = arr.shift() || "", rootRef = getRoot(rootName), prop = arr.pop(), isUniqueCounter = () => rootName == "Container", result;
        while (rootRef && arr.length)
            rootRef = rootRef[arr.shift()];
        if (rootRef == undefined
            || ((result = rootRef[prop]) == undefined
                && (!isUniqueCounter()
                    || (result = rootRef[prop] = base.comp.meta.countStart | 0, false))))
            throw `invalid label template`;
        isUniqueCounter()
            && dab_1.isNum(result)
            && (rootRef[prop] = result + 1);
        return result;
    });
    if (options.label && label != options.label)
        throw `invalid label`;
    else
        options.label = label;
    base.count++;
    !options.onProp && (options.onProp = function () {
        //this happens when this component is created...
    });
    if (name == "wire") {
        item = new wire_1.default(container, options);
        if (container.wireMap.has(item.id))
            throw `duplicated connector`;
        container.wireMap.set(item.id, { c: item, b: [] });
    }
    else {
        options.type = base.comp.type;
        item = container.createItem(options);
        if (container.itemMap.has(item.id))
            throw `duplicated component: ${item.id}`;
        container.itemMap.set(item.id, { c: item, b: [] });
    }
    return item;
}
