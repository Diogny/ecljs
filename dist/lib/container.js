"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const rect_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/rect"));
const interfaces_1 = require("./interfaces");
const bonds_1 = (0, tslib_1.__importDefault)(require("./bonds"));
const wire_1 = (0, tslib_1.__importDefault)(require("./wire"));
const extra_1 = require("./extra");
const dab_1 = require("dabbjs/dist/lib/dab");
class Container extends interfaces_1.Base {
    /**
     * @description creates a library component container
     * @param options configurable options, see below:
     *
     * - store: CompStore;  component store
     */
    constructor(options) {
        super(options);
        //non-configurable properties
        this.$.counters = {};
        this.$.components = new Map();
        this.$.itemMap = new Map();
        this.$.wireMap = new Map();
        this.$.selected = [];
    }
    get selected() { return this.$.selected; }
    get items() { return Array.from(this.$.itemMap.values()).map(item => item.t); }
    get wires() { return Array.from(this.$.wireMap.values()).map(item => item.t); }
    get all() { return this.items.concat(this.wires); }
    get empty() { return !(this.$.wireMap.size || this.$.itemMap.size); }
    get size() { return this.$.itemMap.size + this.$.wireMap.size; }
    get store() { return this.$.store; }
    /**
     * @description gets the component
     * @param id component's id
     */
    get(id) { var _a; return (_a = (0, extra_1.getItem)(this.$, id)) === null || _a === void 0 ? void 0 : _a.t; }
    defaults() {
        return {
            store: void 0,
        };
    }
    root(name) {
        return this.$.components.get(name);
    }
    hasItem(id) { return this.$.itemMap.has(id) || this.$.wireMap.has(id); }
    selectAll(value) {
        return this.$.selected = this.all
            .filter(comp => (comp.select(value), value));
    }
    toggleSelect(comp) {
        comp.select(!comp.selected);
        this.$.selected = this.all.filter(c => c.selected);
    }
    selectThis(comp) {
        return comp
            && (this.selectAll(false).push(comp.select(true)), true);
    }
    unselectThis(comp) {
        comp.select(false);
        this.$.selected = this.all.filter(c => c.selected);
    }
    selectRect(rect) {
        (this.$.selected = this.all.filter((item) => {
            return rect.intersect(item.rect());
        }))
            .forEach(item => item.select(true));
    }
    deleteSelected() {
        let deletedCount = 0;
        this.$.selected = this.selected.filter((c) => {
            if (this.delete(c)) {
                deletedCount++;
                return false;
            }
            return true;
        });
        return deletedCount;
    }
    destroy() {
        this.items.forEach(ec => this.delete(ec));
        this.wires.forEach(wire => this.delete(wire));
        //maps should be empty here
        this.$ = void 0;
    }
    boundariesRect() {
        let array = this.all, first = array.shift(), r = first ? first.rect() : rect_1.default.empty;
        array.forEach(ec => r = r.add(ec.rect()));
        return r.grow(20, 20);
    }
    /**
     * @description adds a new component to this container
     * @param options disctionary of options
     */
    add(options) {
        // let
        // 	comp: T | Wire = createBoardItem.call(this, this.$, options);
        // // if (comp.type != Type.WIRE && comp.base.library != this.name)
        // // 	throw `component incompatible type`;
        return createBoardItem(this, this.$, options);
    }
    /**
     * @description deletes a component from the board, and unbonds all nodes
     * @param comp component
     */
    delete(comp) {
        if (comp == undefined)
            return false;
        let list = this.disconnect(comp);
        comp.remove();
        list.forEach(id => {
            let nc = this.get(id);
            nc && (nc.type == interfaces_1.Type.WIRE) && this.delete(nc);
        });
        return (comp.type == interfaces_1.Type.WIRE) ?
            this.$.wireMap.delete(comp.id) :
            this.$.itemMap.delete(comp.id);
    }
    /**
     * @description gets all bonds of a component
     * @param item component
     */
    itemBonds(item) {
        var _a, _b;
        //"bonds" cannot be filtered so array node indexes don't get lost
        return ((_a = this.$.itemMap.get(item.id)) === null || _a === void 0 ? void 0 : _a.b) || ((_b = this.$.wireMap.get(item.id)) === null || _b === void 0 ? void 0 : _b.b);
    }
    /**
     * @description returns the bonds of a node
     * @param item board component
     * @param node 0-based node
     */
    nodeBonds(item, node) {
        let bonds = this.itemBonds(item);
        return bonds && bonds[node];
    }
    /**
     * @description bonds two components two-way
     * @param thisObj start component
     * @param node 0-based node
     * @param ic component to bond to
     * @param icNode component node
     */
    bond(thisObj, thisNode, ic, icNode) {
        if (!this.hasItem(thisObj.id) || !this.hasItem(ic.id))
            return false;
        return this.bondOneWay(thisObj, thisNode, ic, icNode, 0) // from A to B
            && this.bondOneWay(ic, icNode, thisObj, thisNode, 1); // back B to A
    }
    bondOneWay(thisObj, thisNode, ic, icNode, dir) {
        let item = (0, extra_1.getItem)(this.$, thisObj.id), entry = item && item.b[thisNode];
        if (!item)
            return false;
        if (!ic
            || (entry && entry.has(ic.id))
            || !ic.valid(icNode))
            return false;
        if (entry) {
            if (!entry.add(ic, icNode))
                throw new Error(`duplicated bond`);
        }
        else {
            //this's the origin of the bond
            entry = new bonds_1.default(thisObj, thisNode, ic, icNode, dir);
            item.b[thisNode] = entry;
        }
        item.c++;
        thisObj.nodeRefresh(thisNode);
        return true;
    }
    /**
       * @description unbonds a node from a component
       * @param thisObj component to unbond
       * @param node 0-base node to unbond
       * @param id component to unbond from
       */
    unbond(thisObj, node, id) {
        return unbond(this.$, thisObj.id, node, id, true);
    }
    /**
     * @description unbonds a component node
     * @param thisObj component to be unbonded
     * @param node 0-based node
     * @returns undefined if not bonded, otherwise thisObj::Bond.dir and list of disconnected wire ids
     */
    unbondNode(thisObj, node) {
        let item = (0, extra_1.getItem)(this.$, thisObj.id), bond = item && item.b[node], link = void 0, list = [];
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
    }
    /**
     * @description removes all bonds of a component
     * @param comp component to disconnect
     * @returns list of removed component's id
     */
    disconnect(comp) {
        let list = [];
        for (let node = 0; node < comp.count; node++) {
            let data = this.unbondNode(comp, node);
            data && data.bonds.forEach(b => list.push(b.id));
        }
        return list;
    }
    getAllBonds() {
        let bonds = [], keyDict = new Set(), findBonds = (bond) => {
            //always return only the origin Bond
            if (bond.dir === 0) {
                let fromId = bond.from.id, fromNdx = bond.from.ndx, keyRoot = `${fromId},${fromNdx}`;
                bond.to.forEach(b => {
                    let otherRoot = `${b.id},${b.ndx}`, key0 = `${keyRoot},${otherRoot}`;
                    if (!keyDict.has(key0)) {
                        keyDict.add(key0).add(`${otherRoot},${keyRoot}`);
                        bonds.push(key0);
                    }
                });
            }
        };
        this.all
            .forEach(comp => { var _a; return (_a = comp.bonds) === null || _a === void 0 ? void 0 : _a.forEach(findBonds); });
        return bonds;
    }
    moveBond(id, node, newIndex) {
        let item = (0, extra_1.getItem)(this.$, id), wire = item === null || item === void 0 ? void 0 : item.t;
        if (!item || !wire || wire.type != interfaces_1.Type.WIRE)
            return;
        let bond = this.nodeBonds(wire, node);
        if (bond) {
            //fix this from index
            bond.from.ndx = newIndex;
            //fix all incoming indexes
            bond.to.forEach(bond => {
                let compTo = wire.container.get(bond.id), compToBonds = compTo && this.nodeBonds(compTo, bond.ndx);
                compToBonds === null || compToBonds === void 0 ? void 0 : compToBonds.to.filter(b => b.id == wire.id).forEach(b => {
                    b.ndx = newIndex;
                });
            });
            //move last bond entry
            delete item.b[node];
            item.b[newIndex] = bond;
        }
    }
}
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
    let item = (0, extra_1.getItem)($, id), bond = item && item.b[node], b = bond === null || bond === void 0 ? void 0 : bond.remove(toId);
    if (bond && b && item) {
        delete item.b[node];
        (--item.c == 0) && (item.b = []);
        if (origin) {
            unbond($, toId, b.ndx, id, false);
        }
        //return [id] bond direction for reference
        return { dir: bond.dir, id: id, node: node, toId: toId, toNode: b.ndx };
    }
    else
        return;
}
function getBaseComp(that, $, name) {
    let obj = {
        comp: that.store.find(name)
    };
    if (!obj.comp)
        throw new Error(`unregistered component: ${name}`);
    if ((obj.tmpl = obj.comp.meta.nameTmpl)) {
        (0, dab_1.dP)(obj, "count", {
            get() {
                return $.counters[obj.tmpl];
            },
            set(val) {
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
function createBoardItem(that, $, options) {
    let base = void 0, item = void 0, setBase = () => {
        if (!(base = that.root(options.name))) {
            base = getBaseComp(that, $, options.name);
            $.components.set(options.name, base);
        }
        options.base = base.comp;
    };
    if (options.id) {
        //this comes from a file read, get id counter
        //get name from id
        let match = (/^([\w-]+)(\d+)$/g).exec(options.id), count = 0;
        if (match == null)
            throw new Error(`invalid id: ${options.id}`);
        //name can't contain numbers at the end,
        //	id = name[count]    nand1	7408IC2	N555IC7	 							doesn't need name
        //		 C[count]	name could be: capacitor, capacitor-polarized, etc.		needs name
        if (!$.counters[match[1]])
            options.name = match[1];
        count = parseInt(match[2]);
        if (count <= 0 || !options.name)
            throw new Error(`invalid id: ${options.id}`);
        setBase();
        //update internal component counter only if count > internal counter
        (count > base.count) && (base.count = count);
    }
    else if (options.name) {
        //this creates a component from option's name
        setBase();
        base.count++;
        if (!base.comp.meta.nameTmpl)
            options.id = `${options.name}${base.count}`;
        else {
            options.id = `${base.comp.meta.nameTmpl}${base.count}`;
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
            throw new Error(`duplicated component: ${item.id}`);
        $.itemMap.set(item.id, { t: item, b: [], c: 0 });
    }
    return item;
}
