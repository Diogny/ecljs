import Rect from "dabbjs/dist/lib/rect";
import { Type, IBaseComponent, IBondNode, IContainerDefaults, Base, IComponent, BondDir } from "./interfaces";
import Bond from "./bonds";
import ItemBoard from "./itemsBoard";
import Wire from "./wire";
import CompStore from "./components";

export default abstract class Container<T extends ItemBoard> extends Base {

	protected $: IContainerDefaults<T>;

	abstract get name(): string;
	abstract get dir(): boolean;
	abstract createItem(options: { [x: string]: any; }): T;

	get counters(): { [x: string]: any; } { return this.$.counters }
	get components(): Map<string, IBaseComponent> { return this.$.components }

	get itemMap(): Map<string, { t: T, b: Bond[], c: number }> { return this.$.itemMap }
	get wireMap(): Map<string, { t: Wire, b: Bond[], c: number }> { return this.$.wireMap }

	get selected(): (T | Wire)[] { return this.$.selected }

	get items(): T[] { return Array.from(this.itemMap.values()).map(item => item.t) }
	get wires(): Wire[] { return Array.from(this.wireMap.values()).map(item => item.t) }
	get all(): (T | Wire)[] { return (this.items as (T | Wire)[]).concat(this.wires) }

	get empty(): boolean { return !(this.wireMap.size || this.itemMap.size) }
	get size(): number { return this.itemMap.size + this.wireMap.size }

	get store(): CompStore { return this.$.store }

	public get(id: string): T | Wire | undefined {
		return this.itemMap.get(id)?.t || this.wireMap.get(id)?.t
	}

	/**
	 * @description creates a library component container
	 * @param store component store
	 */
	constructor(store: CompStore) {
		super({ store: store })
	}

	public defaults(): IContainerDefaults<T> {
		return {
			store: <any>void 0,
			counters: {},
			components: new Map(),
			itemMap: new Map(),
			wireMap: new Map(),
			selected: [],
		}
	}

	public root(name: string): IBaseComponent | undefined {
		return this.components.get(name)
	}

	public hasItem(id: string): boolean { return this.itemMap.has(id) || this.wireMap.has(id); }

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
			comp: T | Wire = createBoardItem(this, options);
		// if (comp.type != Type.WIRE && comp.base.library != this.name)
		// 	throw `component incompatible type`;
		return comp
	}

	public delete(comp: T | Wire): boolean {
		if (comp == undefined)
			return false;
		comp.disconnect();
		comp.remove();
		return (comp.type == Type.WIRE) ?
			this.wireMap.delete(comp.id) :
			this.itemMap.delete(comp.id)
	}

	public itemBonds(item: T | Wire): Bond[] | undefined {
		let
			bonds = this.itemMap.get(item.id)?.b || this.wireMap.get(item.id)?.b;
		//"bonds" cannot be filtered so array node indexes don't get lost
		return bonds
	}

	public nodeBonds(item: T | Wire, node: number): Bond | undefined {
		let
			bonds = this.itemBonds(item);
		return bonds && bonds[node]
	}

	public bond(thisObj: T | Wire, thisNode: number, ic: T | Wire, icNode: number): boolean {
		if (!this.hasItem(thisObj.id) || !this.hasItem(ic.id))
			return false;
		return this.bondOneWay(thisObj, thisNode, ic, icNode, 0)		// from A to B
			&& this.bondOneWay(ic, icNode, thisObj, thisNode, 1)		// back B to A
	}

	protected bondOneWay(thisObj: T | Wire, thisNode: number, ic: T | Wire, icNode: number, dir: BondDir): boolean {
		let
			item = getItem(this, thisObj.id),
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

	public unbond(thisObj: T | Wire, node: number, id: string): void {
		unbond(this, thisObj.id, node, id, true);
	}

	/**
	 * @description unbonds a component node
	 * @param thisObj component to be unbonded
	 * @param node 0-based node
	 * @returns undefined if invalid node, otherwise list of disconnected wire ids
	 */
	public unbondNode(thisObj: T | Wire, node: number): string[] | undefined {
		let
			item = getItem(this, thisObj.id),
			bond = item && item.b[node],
			link: IBondNode = <any>void 0,
			disconnected: string[] = [];
		if (!bond || !item)
			return;
		//try later to use bond.to.forEach, it was giving an error with wire node selection, think it's fixed
		while (bond.to.length) {
			link = bond.to[0];
			unbond(this, link.id, link.ndx, thisObj.id, true);
			disconnected.push(link.id)
		}
		return disconnected
	}

	public disconnect(thisObj: T | Wire) {
		for (let node = 0; node < thisObj.count; node++)
			this.unbondNode(thisObj, node);
	}

	public getAllBonds(): string[] {
		let
			bonds: string[] = [],
			keyDict: Set<string> = new Set(),
			findBonds = (bond: Bond) => {
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
			};
		this.all
			.forEach(comp => comp.bonds?.forEach(findBonds));
		return bonds;
	}

	public moveBond(id: string, node: number, newIndex: number) {
		let
			item = getItem(this, id),
			wire = item?.t as Wire;
		if (!item || !wire || wire.type != Type.WIRE)
			return;
		let
			bond = wire.nodeBonds(node);
		if (bond) {
			//fix this from index
			bond.from.ndx = newIndex;
			//fix all incoming indexes
			bond.to.forEach(bond => {
				let
					compTo = wire.container.get(bond.id),
					compToBonds = compTo?.nodeBonds(bond.ndx);
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

function unbond<T extends ItemBoard>(container: Container<T>, id: string, node: number, toId: string, origin: boolean): void {
	let
		item = getItem(container, id),
		bond = item && item.b[node],
		b = bond?.remove(toId);
	if (bond && b && item) {
		delete item.b[node];
		(--item.c == 0) && (item.b = []);
		if (origin) {
			unbond(container, toId, b.ndx, id, false);
		}
	}
}

function getItem<T extends ItemBoard>(container: Container<T>, id: string)
	: { t: T | Wire, b: Bond[], c: number } | undefined {
	return container.itemMap.get(id) || container.wireMap.get(id)
}

function createBoardItem<T extends ItemBoard>(container: Container<T>, options: { [x: string]: any; }): T | Wire {
	let
		base: IBaseComponent = <any>void 0,
		item: T | Wire = <any>void 0,
		setBase = () => {
			if (!(base = <IBaseComponent>container.root(options.name))) {
				base = {
					comp: <IComponent>container.store.find(options.name),
					count: 0
				};
				if (!base.comp)
					throw `unregistered component: ${options.name}`;
				container.components.set(options.name, base)
			}
			options.base = base.comp;
		}
	if (options.id) {
		//this comes from a file read, get id counter
		//get name from id
		let
			match = (/^(\w+)(\d+)$/g).exec(options.id),
			count = 0;
		if (match == null)
			throw `invalid id: ${options.id}`;
		//name can't contain numbers at the end,
		//	id = name[count]    nand0	7408IC2
		options.name = match[1];
		count = parseInt(match[2]);
		if (count <= 0)
			throw `invalid id: ${options.id}`;
		setBase();
		//update internal component counter only if count > internal counter
		(count > base.count) && (base.count = count)
	} else if (options.name) {
		//this creates a component from option's name
		setBase();
		base.count++;
		if (!base.comp.meta.nameTmpl)
			options.id = `${options.name}${base.count}`		//"{base.comp.name}-{base.count}";
		else {
			options.id = `${base.comp.meta.nameTmpl}${base.count}`
		}
	} else
		throw `invalid component options`;

	!options.onProp && (options.onProp = function () {
		//this happens when this component is created...
	});

	if (options.name == "wire") {
		item = new Wire(container, <any>options);
		if (container.wireMap.has(item.id))
			throw `duplicated connector`;
		container.wireMap.set(item.id, { t: <Wire>item, b: [], c: 0 });
	} else {
		options.type = base.comp.type;
		item = container.createItem(options);
		if (container.itemMap.has(item.id))
			throw `duplicated component: ${item.id}`;
		container.itemMap.set(item.id, { t: <T>item, b: [], c: 0 });
	}
	return item
}
