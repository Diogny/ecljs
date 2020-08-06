import { IPoint, IItemNode, IItemBoardProperties, IItemBaseOptions } from './interfaces';
import { condClass, attr, extend, isFn } from './dab';
import Point from './point';
import Bond from './bonds';
import ItemBase from './itemsBase';
import Container from './container';

//ItemBoard->Wire
export default abstract class ItemBoard extends ItemBase {

	protected settings: IItemBoardProperties;

	get onProp(): Function { return this.settings.onProp }
	get selected(): boolean { return this.settings.selected }
	get bonds(): Bond[] | undefined { return this.container.itemBonds(this) }
	get directional(): boolean { return this.settings.directional }
	get label(): string { return this.settings.label }

	abstract get count(): number;
	abstract valid(node: number): boolean;
	abstract get last(): number;
	abstract refresh(): ItemBoard;
	abstract nodeRefresh(node: number): ItemBoard;
	abstract getNode(node: number): IItemNode;
	abstract getNodeRealXY(node: number): Point;
	abstract setNode(node: number, p: IPoint): ItemBoard;
	abstract overNode(p: IPoint, ln: number): number;
	//finds a matching point, faster
	abstract findNode(p: Point): number;

	//this returns true for an EC, and any Wire node and that it is not a start|end bonded node
	abstract nodeHighlightable(node: number): boolean;

	constructor(public container: Container<ItemBoard>, options: IItemBaseOptions) {
		super(options);
		if (!container)
			throw `component without container`;
		attr(this.g, {
			id: this.id,
			"svg-comp": this.base.type,
		})
		//this still doesn't work to get all overridable properties ¿?
		//properties still cannot access super value
		//(<any>this.settings).__selected = dab.propDescriptor(this, "selected");
	}

	public select(value: boolean): ItemBoard {
		if (this.selected != value) {
			//set new value
			this.settings.selected = value;
			//add class if selected
			condClass(this.g, "selected", this.selected);
			//trigger property changed if applicable
			this.onProp && this.onProp({
				id: `#${this.id}`,
				value: this.selected,
				prop: "selected",
				where: 1				//signals it was a change inside the object
			});
		}
		return this;
	}

	public move(x: number, y: number): ItemBoard {
		super.move(x, y);
		//trigger property changed if applicable
		this.onProp && this.onProp({
			id: `#${this.id}`,
			args: {
				x: this.x,
				y: this.y
			},
			method: 'move',
			where: 1				//signals it was a change inside the object
		})
		return this;
	}

	public setOnProp(value: Function): ItemBoard {
		isFn(value) && (this.settings.onProp = value);
		return this;
	}

	public bond(thisNode: number, ic: ItemBoard, icNode: number): boolean {
		return this.container.bond(this, thisNode, ic, icNode)
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

	public nodeBonds(node: number): Bond | undefined {
		return this.container.nodeBonds(this, node); // <Bond>(<any>this.bonds)[node]
	}

	public unbond(node: number, id: string): void {
		this.container.unbond(this, node, id)
	}

	public unbondNode(node: number): void {
		this.container.unbondNode(this, node)
	}

	public disconnect() {
		this.container.disconnect(this)
	}

	public propertyDefaults(): IItemBoardProperties {
		return extend(super.propertyDefaults(), {
			selected: false,
			onProp: void 0,
			directional: false,
		})
	}

	// public static connectedWiresTo(ecList: EC[]): Wire[] {
	// 	let
	// 		wireList: Wire[] = [],
	// 		ecIdList = ecList.map(ec => ec.id),
	// 		circuit = ecList[0]?.circuit,
	// 		secondTest: { wire: Wire, toId: string }[] = [],
	// 		oppositeEdge = (node: number, last: number) => node == 0 ? last : (node == last ? 0 : node);
	// 	if (circuit) {
	// 		ecList.forEach(ec => {
	// 			ec.bonds.forEach(bond => {
	// 				bond.to
	// 					.filter(b => !wireList.find(w => w.id == b.id))
	// 					.forEach(b => {
	// 						let
	// 							wire = circuit.get(b.id) as Wire,
	// 							toWireBond = wire.nodeBonds(oppositeEdge(b.ndx, wire.last));
	// 						if (toWireBond.to[0].type == Type.EC) {
	// 							ecIdList.includes(toWireBond.to[0].id)
	// 								&& wireList.push(wire)
	// 						} else {
	// 							if (wireList.find(w => w.id == toWireBond.to[0].id)) {
	// 								wireList.push(wire);
	// 							} else {
	// 								secondTest.push({
	// 									wire: wire,
	// 									toId: toWireBond.to[0].id
	// 								})
	// 							}
	// 						}
	// 					})
	// 			})
	// 		});
	// 		secondTest
	// 			.forEach(b => wireList.find(w => w.id == b.toId) && wireList.push(b.wire))
	// 	}
	// 	return wireList;
	// }

	// public static wireConnections(wire: Wire): { it: ItemBoard, p: Point, n: number }[] {
	// 	let
	// 		wireCollection: Wire[] = [wire],
	// 		wiresFound: string[] = [],
	// 		points: { it: ItemBoard, p: Point, n: number }[] = [],
	// 		circuit = wire.circuit,
	// 		findComponents = (bond: Bond) => {
	// 			bond.to.forEach(b => {
	// 				let
	// 					w = circuit.get(b.id);
	// 				if (!w)
	// 					throw `Invalid bond connections`;			//shouldn't happen, but to catch wrong code
	// 				switch (b.type) {
	// 					case Type.WIRE:
	// 						if (!wiresFound.some(id => id == b.id)) {
	// 							wiresFound.push(w.id);
	// 							wireCollection.push(w as Wire);
	// 							points.push({
	// 								it: w,
	// 								p: Point.create(w.getNode(b.ndx)),
	// 								n: b.ndx
	// 							});
	// 						}
	// 						break;
	// 					case Type.EC:
	// 						points.push({
	// 							it: w,
	// 							p: (w as EC).getNodeRealXY(b.ndx),
	// 							n: b.ndx
	// 						});
	// 						break;
	// 				}
	// 			})
	// 		};
	// 	while (wireCollection.length) {
	// 		let
	// 			w = <Wire>wireCollection.shift();
	// 		wiresFound.push(w.id);
	// 		w.bonds.forEach(findComponents);
	// 	}
	// 	return points
	// }

}

