"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dab_1 = require("./dab");
const itemsBase_1 = tslib_1.__importDefault(require("./itemsBase"));
//ItemBoard->Wire
class ItemBoard extends itemsBase_1.default {
    constructor(container, options) {
        super(options);
        this.container = container;
        if (!container)
            throw `component without container`;
        dab_1.attr(this.g, {
            id: this.id,
            "svg-comp": this.base.type,
        });
        //this still doesn't work to get all overridable properties ¿?
        //properties still cannot access super value
        //(<any>this.settings).__selected = dab.propDescriptor(this, "selected");
    }
    get onProp() { return this.settings.onProp; }
    get selected() { return this.settings.selected; }
    get bonds() { return this.container.itemBonds(this); }
    get directional() { return this.settings.directional; }
    get label() { return this.settings.label; }
    select(value) {
        if (this.selected != value) {
            //set new value
            this.settings.selected = value;
            //add class if selected
            dab_1.condClass(this.g, "selected", this.selected);
            //trigger property changed if applicable
            this.onProp && this.onProp({
                id: `#${this.id}`,
                value: this.selected,
                prop: "selected",
                where: 1 //signals it was a change inside the object
            });
        }
        return this;
    }
    move(x, y) {
        super.move(x, y);
        //trigger property changed if applicable
        this.onProp && this.onProp({
            id: `#${this.id}`,
            args: {
                x: this.x,
                y: this.y
            },
            method: 'move',
            where: 1 //signals it was a change inside the object
        });
        return this;
    }
    setOnProp(value) {
        dab_1.isFn(value) && (this.settings.onProp = value);
        return this;
    }
    bond(thisNode, ic, icNode) {
        return this.container.bond(this, thisNode, ic, icNode);
    }
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
    nodeBonds(node) {
        return this.container.nodeBonds(this, node); // <Bond>(<any>this.bonds)[node]
    }
    unbond(node, id) {
        this.container.unbond(this, node, id);
    }
    unbondNode(node) {
        this.container.unbondNode(this, node);
    }
    disconnect() {
        this.container.disconnect(this);
    }
    propertyDefaults() {
        return dab_1.extend(super.propertyDefaults(), {
            selected: false,
            onProp: void 0,
            directional: false,
        });
    }
}
exports.default = ItemBoard;
