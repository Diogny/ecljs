import { Type, IBaseComponent, IBondLink, IContainerProperties, Base } from "./interfaces";
import { isNum } from "./dab";
import Rect from "./rect";
import Bond from "./bonds";
import ItemBoard from "./itemsBoard";
import Wire from "./wire";
import Comp from "./components";
import Board from "./board";

export default abstract class Container<T extends ItemBoard> extends Base {

	protected __s: IContainerProperties<T>;

	get name(): string { return this.__s.name }
	set name(value: string) {
		this.__s.name = value;
		this.modified = true
	}
	get board(): Board { return this.__s.board }
	abstract get library(): string;
	abstract get directional(): boolean;

	get counters(): { [x: string]: any; } { return this.__s.counters }
	get components(): Map<string, IBaseComponent> { return this.__s.components }

	get itemMap(): Map<string, { t: T, b: Bond[], c: number }> { return this.__s.itemMap }
	get wireMap(): Map<string, { t: Wire, b: Bond[], c: number }> { return this.__s.wireMap }

	get selected(): (T | Wire)[] { return this.__s.selected }

	get items(): T[] { return Array.from(this.itemMap.values()).map(item => item.t) }
	get wires(): Wire[] { return Array.from(this.wireMap.values()).map(item => item.t) }
	get all(): (T | Wire)[] { return (this.items as (T | Wire)[]).concat(this.wires) }

	get empty(): boolean { return !(this.wireMap.size || this.itemMap.size) }
	get size(): number { return this.itemMap.size + this.wireMap.size }

	public get(id: string): T | Wire | undefined {
		return this.itemMap.get(id)?.t || this.wireMap.get(id)?.t
	}

	get modified(): boolean { return this.__s.modified }
	set modified(value: boolean) {
		if (value == this.modified)
			return;
		this.__s.modified = value;
		this.board.modified = true
	}

	constructor(board: Board, name: string) {
		super({
			name: name,
			board: board
		})
	}

	public defaults(): IContainerProperties<T> {
		return <IContainerProperties<T>>{
			name: "",
			board: <any>void 0,
			counters: {},
			components: new Map(),
			itemMap: new Map(),
			wireMap: new Map(),
			selected: [],
			modified: false,
		}
	}

	public root(name: string): IBaseComponent | undefined {
		return this.components.get(name)
	}

	public hasComponent(id: string): boolean { return this.itemMap.has(id) || this.wireMap.has(id); }

	public selectAll(value: boolean): (T | Wire)[] {
		return this.__s.selected = this.all
			.filter(comp => (comp.select(value), value))
	}

	public toggleSelect(comp: T) {
		comp.select(!comp.selected);
		this.__s.selected = this.all.filter(c => c.selected);
	}

	public selectThis(comp: T | Wire): boolean {
		return comp
			&& (this.selectAll(false).push(comp.select(true) as T | Wire), true)
	}

	public unselectThis(comp: T) {
		comp.select(false);
		this.__s.selected = this.all.filter(c => c.selected);
	}

	public selectRect(rect: Rect) {
		(this.__s.selected = this.all.filter((item) => {
			return rect.intersect(item.rect())
		}))
			.forEach(item => item.select(true));
	}

	public deleteSelected(): number {
		let
			deletedCount = 0;
		this.__s.selected = this.selected.filter((c) => {
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
		this.__s = <any>void 0;
	}

	public boundariesRect(): Rect {
		let
			array = this.all,
			first = array.shift(),
			r = first ? first.rect() : Rect.empty();
		array.forEach(ec => r.add(ec.rect()));
		r.grow(20, 20);
		return r;
	}

	abstract createItem(options: { [x: string]: any; }): T;

	public add(options: { [x: string]: any; }): T | Wire {
		let
			comp: T | Wire = createBoardItem(this, options);
		if (comp.type != Type.WIRE && comp.base.library != this.library)
			throw `component incompatible type`;
		this.modified = true;
		return comp
	}

	public delete(comp: T | Wire): boolean {
		if (comp == undefined)
			return false;
		comp.disconnect();
		comp.remove();
		this.modified = true;
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
		if (!this.hasComponent(thisObj.id) || !this.hasComponent(ic.id))
			return false;
		return this.bondSingle(thisObj, thisNode, ic, icNode, true)
			&& this.bondSingle(ic, icNode, thisObj, thisNode, false)
			&& (this.modified = true)
	}

	protected bondSingle(thisObj: T | Wire, thisNode: number, ic: T | Wire, icNode: number, origin: boolean): boolean {
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
			if (!entry.add(ic, icNode))
				throw `duplicated bond`;
		} else {
			//this's the origin of the bond
			entry = new Bond(thisObj, thisNode, ic, icNode, origin);
			item.b[thisNode] = entry;
		}
		item.c++;
		thisObj.nodeRefresh(thisNode);
		return true
	}

	public unbond(thisObj: T | Wire, node: number, id: string): void {
		unbond(this, thisObj.id, node, id, true);
	}

	public unbondNode(thisObj: T | Wire, node: number): void {
		let
			item = getItem(this, thisObj.id),
			bond = item && item.b[node],
			link: IBondLink = <any>void 0;
		if (!bond || !item)
			return;
		//try later to use bond.to.forEach, it was giving an error with wire node selection, think it's fixed
		while (bond.to.length) {
			link = bond.to[0];
			unbond(this, link.id, link.ndx, thisObj.id, true)
		}
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
		container.modified = true
	}
}

function getItem<T extends ItemBoard>(container: Container<T>, id: string)
	: { t: T | Wire, b: Bond[], c: number } | undefined {
	return container.itemMap.get(id) || container.wireMap.get(id)
}

function createBoardItem<T extends ItemBoard>(container: Container<T>, options: { [x: string]: any; }): T | Wire {
	let
		regex = /(?:{([^}]+?)})+/g,
		name = options.name || "",
		base = <IBaseComponent>container.root(name),
		newComp = !base,
		item: T | Wire = <any>void 0;
	!base && (base = {
		comp: <Comp>Comp.find(name),
		count: 0
	});
	if (!base.comp)
		throw `unregistered component: ${name}`;
	newComp
		&& (base.count = base.comp.meta.countStart | 0, container.components.set(name, base));
	options.base = base.comp;
	if (!options.id) {
		options.id = `${name}-${base.count}`;
	}
	let
		label = base.comp.meta.nameTmpl.replace(regex,
			function (match: string, group: string): string { //, offset: number, str: string
				let
					arr = group.split('.'),
					getRoot = (name: string): any => {
						//valid entry points
						switch (name) {
							case "base": return base;
							case "Container": return container.counters;
						}
					},
					rootName = arr.shift() || "",
					rootRef = getRoot(rootName),
					prop: string = <any>arr.pop(),
					isUniqueCounter = () => rootName == "Container",
					result: any;
				while (rootRef && arr.length)
					rootRef = rootRef[<any>arr.shift()];
				if (rootRef == undefined
					|| ((result = rootRef[prop]) == undefined
						&& (!isUniqueCounter()
							|| (result = rootRef[prop] = base.comp.meta.countStart | 0, false)))
				)
					throw `invalid label template`;
				isUniqueCounter()
					&& isNum(result)
					&& (rootRef[<any>prop] = result + 1)
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
