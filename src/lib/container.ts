import Rect from "dabbjs/dist/lib/rect";
import { Type, IBaseComponent, IBondNode, IContainerDefaults, Base, IComponent, BondDir, IUnbondNodeData, IUnbondData } from "./interfaces";
import Bond from "./bonds";
import ItemBoard from "./itemsBoard";
import Wire from "./wire";
import CompStore from "./components";
import { getItem } from "./extra";
import { dP } from "dabbjs/dist/lib/dab";

export default abstract class Container<T extends ItemBoard> extends Base {

	protected $: IContainerDefaults<T>;

	abstract get name(): string;
	abstract get dir(): boolean;
	abstract createItem(options: { [x: string]: any; }): T;

	get selected(): (T | Wire)[] { return this.$.selected }

	get items(): T[] { return Array.from(this.$.itemMap.values()).map(item => item.t) }
	get wires(): Wire[] { return Array.from(this.$.wireMap.values()).map(item => item.t) }
	get all(): (T | Wire)[] { return (this.items as (T | Wire)[]).concat(this.wires) }

	get empty(): boolean { return !(this.$.wireMap.size || this.$.itemMap.size) }
	get size(): number { return this.$.itemMap.size + this.$.wireMap.size }

	get store(): CompStore { return this.$.store }

	/**
	 * @description gets the component
	 * @param id component's id
	 */
	public get(id: string): T | Wire | undefined { return getItem(this.$, id)?.t }

	/**
	 * @description creates a library component container
	 * @param options configurable options, see below:
	 * 
	 * - store: CompStore;  component store
	 */
	constructor(options: { [x: string]: any; }) {//store: CompStore
		super(options);
		//non-configurable properties
		this.$.counters = {};
		this.$.components = new Map();
		this.$.itemMap = new Map();
		this.$.wireMap = new Map();
		this.$.selected = []
	}

	public defaults(): IContainerDefaults<T> {
		return <IContainerDefaults<T>>{
			store: <any>void 0,
		}
	}

	public root(name: string): IBaseComponent | undefined {
		return this.$.components.get(name)
	}

	public hasItem(id: string): boolean { return this.$.itemMap.has(id) || this.$.wireMap.has(id); }

	public selectAll(value: boolean): (T | Wire)[] {
		return this.$.selected = this.all
			.filter(comp => (comp.select(value), value))
	}

	public toggleSelect(comp: T) {
		comp.select(!comp.selected);
		this.$.selected = this.all.filter(c => c.selected);
	}

	public selectThis(comp: T | Wire): boolean {
		return comp
			&& (this.selectAll(false).push(comp.select(true) as T | Wire), true)
	}

	public unselectThis(comp: T) {
		comp.select(false);
		this.$.selected = this.all.filter(c => c.selected);
	}

	public selectRect(rect: Rect) {
		(this.$.selected = this.all.filter((item) => {
			return rect.intersect(item.rect())
		}))
			.forEach(item => item.select(true));
	}

	public deleteSelected(): number {
		let
			deletedCount = 0;
		this.$.selected = this.selected.filter((c) => {
			if (this.delete(c)) {
				deletedCount++;
				return false;
			}
			return true;
		});
		return deletedCount
	}

	public destroy() {
		this.items.forEach(ec => this.delete(ec));
		this.wires.forEach(wire => this.delete(wire));
		//maps should be empty here
		this.$ = <any>void 0;
	}

	public boundariesRect(): Rect {
		let
			array = this.all,
			first = array.shift(),
			r = first ? first.rect() : Rect.empty;
		array.forEach(ec => r.add(ec.rect()));
		r.grow(20, 20);
		return r;
	}

	/**
	 * @description adds a new component to this container
	 * @param options disctionary of options
	 */
	public add(options: { [x: string]: any; }): T | Wire {
		let
			comp: T | Wire = createBoardItem.call(this, this.$, options);
		// if (comp.type != Type.WIRE && comp.base.library != this.name)
		// 	throw `component incompatible type`;
		return comp
	}

	/**
	 * @description deletes a component from the board, and unbonds all nodes
	 * @param comp component
	 */
	public delete(comp: T | Wire): boolean {
		if (comp == undefined)
			return false;
		let
			list = this.disconnect(comp);
		comp.remove();
		list.forEach(id => {
			let
				nc = this.get(id);
			nc && (nc.type == Type.WIRE) && this.delete(nc)
		})
		return (comp.type == Type.WIRE) ?
			this.$.wireMap.delete(comp.id) :
			this.$.itemMap.delete(comp.id)
	}

	/**
	 * @description gets all bonds of a component
	 * @param item component
	 */
	public itemBonds(item: T | Wire): Bond[] | undefined {
		let
			bonds = this.$.itemMap.get(item.id)?.b || this.$.wireMap.get(item.id)?.b;
		//"bonds" cannot be filtered so array node indexes don't get lost
		return bonds
	}

	/**
	 * @description returns the bonds of a node
	 * @param item board component
	 * @param node 0-based node
	 */
	public nodeBonds(item: T | Wire, node: number): Bond | undefined {
		let
			bonds = this.itemBonds(item);
		return bonds && bonds[node]
	}

	/**
	 * @description bonds two components two-way
	 * @param thisObj start component
	 * @param node 0-based node
	 * @param ic component to bond to
	 * @param icNode component node
	 */
	public bond(thisObj: T | Wire, thisNode: number, ic: T | Wire, icNode: number): boolean {
		if (!this.hasItem(thisObj.id) || !this.hasItem(ic.id))
			return false;
		return this.bondOneWay(thisObj, thisNode, ic, icNode, 0)		// from A to B
			&& this.bondOneWay(ic, icNode, thisObj, thisNode, 1)		// back B to A
	}

	protected bondOneWay(thisObj: T | Wire, thisNode: number, ic: T | Wire, icNode: number, dir: BondDir): boolean {
		let
			item = getItem(this.$, thisObj.id),
			entry = item && item.b[thisNode];
		if (!item)
			return false;
		if (!ic
			|| (entry && entry.has(ic.id))
			|| !ic.valid(icNode))
			return false;
		if (entry) {
			if (!entry.add(<ItemBoard>ic, icNode))
				throw `duplicated bond`;
		} else {
			//this's the origin of the bond
			entry = new Bond(<ItemBoard>thisObj, thisNode, <ItemBoard>ic, icNode, dir);
			item.b[thisNode] = entry;
		}
		item.c++;
		thisObj.nodeRefresh(thisNode);
		return true
	}

	/**
		 * @description unbonds a node from a component
		 * @param thisObj component to unbond
		 * @param node 0-base node to unbond
		 * @param id component to unbond from
		 */
	public unbond(thisObj: T | Wire, node: number, id: string): IUnbondData | undefined {
		return unbond(this.$, thisObj.id, node, id, true)
	}

	/**
	 * @description unbonds a component node
	 * @param thisObj component to be unbonded
	 * @param node 0-based node
	 * @returns undefined if not bonded, otherwise thisObj::Bond.dir and list of disconnected wire ids
	 */
	public unbondNode(thisObj: T | Wire, node: number): IUnbondNodeData | undefined {
		let
			item = getItem(this.$, thisObj.id),
			bond = item && item.b[node],
			link: IBondNode = <any>void 0,
			list: { id: string, node: number }[] = [];
		if (!bond || !item)
			return;
		//try later to use bond.to.forEach, it was giving an error with wire node selection, think it's fixed
		while (bond.to.length) {
			link = bond.to[0];
			//arbitrarily unbond a node, no matter its direction, so "origin" must be true to go the other way
			unbond(this.$, link.id, link.ndx, thisObj.id, true);
			list.push({ id: link.id, node: link.ndx })
		}
		return { dir: bond.dir, id: thisObj.id, node: node, bonds: list }
	}

	/**
	 * @description removes all bonds of a component
	 * @param comp component to disconnect
	 * @returns list of removed component's id
	 */
	public disconnect(comp: T | Wire): string[] {
		let
			list: string[] = [];
		for (let node = 0; node < comp.count; node++) {
			let
				data = this.unbondNode(comp, node);
			data && data.bonds.forEach(b => list.push(b.id));
		}
		return list
	}

	public getAllBonds(): string[] {
		let
			bonds: string[] = [],
			keyDict: Set<string> = new Set(),
			findBonds = (bond: Bond) => {
				//always return only the origin Bond
				if (bond.dir === 0) {
					let
						fromId = bond.from.id,
						fromNdx = bond.from.ndx,
						keyRoot = `${fromId},${fromNdx}`;
					bond.to.forEach(b => {
						let
							otherRoot = `${b.id},${b.ndx}`,
							key0 = `${keyRoot},${otherRoot}`;
						if (!keyDict.has(key0)) {
							keyDict.add(key0).add(`${otherRoot},${keyRoot}`);
							bonds.push(key0);
						}
					})
				}
			};
		this.all
			.forEach(comp => comp.bonds?.forEach(findBonds));
		return bonds;
	}

	public moveBond(id: string, node: number, newIndex: number) {
		let
			item = getItem(this.$, id),
			wire = item?.t as Wire;
		if (!item || !wire || wire.type != Type.WIRE)
			return;
		let
			bond = this.nodeBonds(wire, node);
		if (bond) {
			//fix this from index
			bond.from.ndx = newIndex;
			//fix all incoming indexes
			bond.to.forEach(bond => {
				let
					compTo = <T | Wire>wire.container.get(bond.id),
					compToBonds = compTo && this.nodeBonds(compTo, bond.ndx);
				compToBonds?.to
					.filter(b => b.id == wire.id)
					.forEach(b => {
						b.ndx = newIndex;
					})
			});
			//move last bond entry
			delete item.b[node];
			item.b[newIndex] = bond;
		}
	}
}

/**
 * @description unbonds two components, Comp with Wire, or Two Wires
 * @param container container
 * @param id component id
 * @param node id::node
 * @param toId the component id belonging to id::bonds
 * @param origin true to unbond the other way back
 * @returns BondDir of id Bond is any or undefined for not bonded
 */
function unbond<T extends ItemBoard>($: IContainerDefaults<T>, id: string, node: number, toId: string, origin: boolean)
	: IUnbondData | undefined {
	let
		item = getItem($, id),
		bond = item && item.b[node],
		b = bond?.remove(toId);
	if (bond && b && item) {
		delete item.b[node];
		(--item.c == 0) && (item.b = []);
		if (origin) {
			unbond($, toId, b.ndx, id, false);
		}
		//return [id] bond direction for reference
		return { dir: bond.dir, id: id, node: node, toId: toId, toNode: b.ndx }
	}
}

function getBaseComp<T extends ItemBoard>($: IContainerDefaults<T>, name: string) {
	let
		that = <Container<T>>this,
		obj: { [x: string]: any; } = {
			comp: <IComponent>that.store.find(name)
		};
	if (!obj.comp)
		throw new Error(`unregistered component: ${name}`);
	if ((obj.tmpl = obj.comp.meta.nameTmpl)) {
		dP(obj, "count", {
			get(): number {
				return $.counters[obj.tmpl]
			},
			set(val: number) {
				$.counters[obj.tmpl] = val
			}
		});
		isNaN(obj.count) && (obj.count = 0)
	} else
		obj.count = 0;
	return obj
}

/**
 * @description creates a board component
 * @param container container
 * @param options options to create component
 */
function createBoardItem<T extends ItemBoard>($: IContainerDefaults<T>, options: { [x: string]: any; }): T | Wire {
	let
		that = <Container<T>>this,
		base: IBaseComponent = <any>void 0,
		item: T | Wire = <any>void 0,
		setBase = () => {
			if (!(base = <IBaseComponent>that.root(options.name))) {
				base = <IBaseComponent>getBaseComp.call(that, $, options.name);
				$.components.set(options.name, base)
			}
			options.base = base.comp;
		}
	if (options.id) {
		//this comes from a file read, get id counter
		//get name from id
		let
			match = (/^([\w-]+)(\d+)$/g).exec(options.id),
			count = 0;
		if (match == null)
			throw `invalid id: ${options.id}`;
		//name can't contain numbers at the end,
		//	id = name[count]    nand1	7408IC2	N555IC7	 							doesn't need name
		//		 C[count]	name could be: capacitor, capacitor-polarized, etc.		needs name
		if (!$.counters[match[1]])
			options.name = match[1];
		count = parseInt(match[2]);
		if (count <= 0 || !options.name)
			throw `invalid id: ${options.id}`;
		setBase();
		//update internal component counter only if count > internal counter
		(count > base.count) && (base.count = count)
	} else if (options.name) {
		//this creates a component from option's name
		setBase();
		base.count++;
		if (!base.comp.meta.nameTmpl)
			options.id = `${options.name}${base.count}`
		else {
			options.id = `${base.comp.meta.nameTmpl}${base.count}`
		}
	} else
		throw new Error('invalid component options');

	!options.onProp && (options.onProp = function () {
		//this happens when this component is created...
	});

	if (options.name == "wire") {
		item = new Wire(that, <any>options);
		if ($.wireMap.has(item.id))
			throw new Error('duplicated connector');
		$.wireMap.set(item.id, { t: <Wire>item, b: [], c: 0 });
	} else {
		options.type = base.comp.type;
		item = that.createItem(options);
		if ($.itemMap.has(item.id))
			throw new Error(`duplicated component: ${item.id}`);
		$.itemMap.set(item.id, { t: <T>item, b: [], c: 0 });
	}
	return item
}
