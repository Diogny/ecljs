import { Type, IBaseComponent, IPoint, IBondLink, IContainerProperties, BaseSettings } from "./interfaces";
import { isNum } from "./dab";
import Rect from "./rect";
import Bond from "./bonds";
import ItemBoard from "./itemsBoard";
import Wire from "./wire";
import Comp from "./components";

export default abstract class Container<T extends ItemBoard> extends BaseSettings {

	abstract get name(): string;
	abstract get library(): string;
	abstract get directionalWires(): boolean;

	protected settings: IContainerProperties<T>;

	get uniqueCounters(): { [x: string]: any; } { return this.settings.uniqueCounters }
	get componentTemplates(): Map<string, IBaseComponent> { return this.settings.componentTemplates }

	get itemMap(): Map<string, { c: T, b: Bond[] }> { return this.settings.itemMap }
	get wireMap(): Map<string, { c: Wire, b: Bond[] }> { return this.settings.wireMap }

	get selected(): T[] { return this.settings.selected }

	get components(): T[] { return Array.from(this.itemMap.values()).map(item => item.c) }
	get wires(): Wire[] { return Array.from(this.wireMap.values()).map(item => item.c) }
	get all(): (T | Wire)[] { return (this.components as (T | Wire)[]).concat(this.wires) }

	get empty(): boolean { return !(this.wireMap.size || this.itemMap.size) }
	get size(): number { return this.itemMap.size + this.wireMap.size }

	public get(id: string): T | Wire | undefined {
		return this.itemMap.get(id)?.c || this.wireMap.get(id)?.c
	}

	get modified(): boolean { return this.settings.modified }
	set modified(value: boolean) {
		if (value == this.modified)
			return;
		this.settings.modified = value;
	}

	constructor() {
		super({});
	}

	public propertyDefaults(): IContainerProperties<T> {
		return <IContainerProperties<T>>{
			uniqueCounters: {},
			componentTemplates: new Map(),
			itemMap: new Map(),
			wireMap: new Map(),
			selected: [],
			modified: false,
		}
	}

	public rootComponent(name: string): IBaseComponent | undefined {
		return this.componentTemplates.get(name)
	}

	public hasComponent(id: string): boolean { return this.itemMap.has(id) || this.wireMap.has(id); }

	public selectAll(value: boolean): T[] {
		return this.settings.selected = Array.from(this.itemMap.values())
			.filter(comp => (comp.c.select(value), value))
			.map(item => item.c)
	}

	public toggleSelect(comp: T) {
		comp.select(!comp.selected);
		this.settings.selected =
			this.components.filter(c => c.selected);
	}

	public selectThis(comp: T): boolean {
		return comp
			&& (this.selectAll(false).push(comp.select(true) as T), true)
	}

	public unselectThis(comp: T) {
		comp.select(false);
		this.settings.selected =
			this.components.filter(c => c.selected);
	}

	public selectRect(rect: Rect) {
		(this.settings.selected =
			this.components.filter((item) => {
				return rect.intersect(item.rect())
			}))
			.forEach(item => item.select(true));
	}

	public deleteSelected(): number {
		let
			deletedCount = 0;
		this.settings.selected =
			this.selected.filter((c) => {
				if (this.delete(c)) {
					deletedCount++;
					return false;
				}
				return true;
			});
		return deletedCount
	}

	public destroy() {
		this.components.forEach(ec => this.delete(ec));
		this.wires.forEach(wire => this.delete(wire));
		//maps should be empty here
		this.settings = <any>void 0;
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
		if (comp.type == Type.WIRE ?
			this.wireMap.delete(comp.id) :
			this.itemMap.delete(comp.id)
		) {
			comp.disconnect();
			comp.remove();
			this.modified = true;
			return true
		}
		return false
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
	}

	protected bondSingle(thisObj: T | Wire, thisNode: number, ic: T | Wire, icNode: number, origin: boolean): boolean {
		let
			item = getItem(this, thisObj.id),
			entry = item && item.b[thisNode]; // this.nodeBonds(thisObj, thisNode);
		if (!item)
			return false;
		if (!ic
			|| (entry && entry.has(ic.id))
			|| !ic.valid(icNode))
			return false;
		if (entry) {
			if (!entry.add(ic, icNode)) {
				console.log('Oooopsie!')
			}
		} else {
			//this's the origin of the bond
			entry = new Bond(thisObj, thisNode, ic, icNode, origin);
			item.b[thisNode] = entry;
		}
		thisObj.nodeRefresh(thisNode);
		return true
	}

	public unbond(thisObj: T | Wire, node: number, id: string): void {
		let
			item = getItem(this, thisObj.id),
			bond = item && item.b[node], //this.nodeBonds(node),
			b = bond?.remove(id);
		if (bond && b && item) {
			if (bond.count == 0) {
				delete item.b[node];
				//(--this.settings.bondsCount == 0) && (this.settings.bonds = []);
			}
			thisObj.nodeRefresh(node);
			let
				ic = this.get(id);
			ic && ic.unbond(b.ndx, thisObj.id);
		}
	}

	public unbondNode(thisObj: T | Wire, node: number): void {
		let
			item = getItem(this, thisObj.id),
			bond = item && item.b[node],
			link: IBondLink = <any>void 0;
		if (!bond)
			return;
		//try later to use bond.to.forEach, it was giving an error with wire node selection, think it's fixed
		for (let i = 0, len = bond.to.length; i < len; i++) {
			link = bond.to[i];
			this.get(link.id)?.unbond(link.ndx, bond.from.id);
		}
		delete item?.b[node];
		//(--this.settings.bondsCount == 0) && (this.settings.bonds = []);
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

}

function getItem<T extends ItemBoard>(container: Container<T>, id: string)
	: { c: T | Wire, b: { [x: number]: Bond } } | undefined {
	return container.itemMap.get(id) || container.wireMap.get(id)
}

function createBoardItem<T extends ItemBoard>(container: Container<T>, options: { [x: string]: any; }): T | Wire {
	let
		regex = /(?:{([^}]+?)})+/g,
		name = options.name || "",
		base = <IBaseComponent>container.rootComponent(name),
		newComp = !base,
		item: T | Wire = <any>void 0;
	!base && (base = {
		comp: <Comp>Comp.find(name),
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
	let
		label = base.comp.meta.nameTmpl.replace(regex,
			function (match: string, group: string): string { //, offset: number, str: string
				let
					arr = group.split('.'),
					getRoot = (name: string): any => {
						//valid entry points
						switch (name) {
							case "base": return base;
							case "Container": return container.uniqueCounters;
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
		container.wireMap.set(item.id, { c: <Wire>item, b: [] });
	} else {
		options.type = base.comp.type;
		item = container.createItem(options);
		if (container.itemMap.has(item.id))
			throw `duplicated component: ${item.id}`;
		container.itemMap.set(item.id, { c: <T>item, b: [] });
	}
	return item
}
