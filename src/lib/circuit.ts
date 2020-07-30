import EC from "./ec";
import Wire from "./wire";
import ItemBoard from "./itemsBoard";
import { Type } from "./types";
import Rect from "./rect";
import { isNum } from "./dab";
// import * as xml2js from 'xml2js';
// import * as fs from 'fs';
import { IPoint, IBaseComponent } from "./interfaces";
import Point from "./point";
import Comp from "./components";
import Bond from "./bonds";
import { Templates } from "./templates";

export default class Circuit {

	version: string;
	name: string;
	description: string;

	uniqueCounters: any;
	compMap: Map<string, IBaseComponent>;

	ecMap: Map<string, EC>;
	wireMap: Map<string, Wire>;

	public rootComponent(name: string): IBaseComponent | undefined {
		return this.compMap.get(name)
	}

	public static defaultZoom: number = 0.5;// 2X

	__zoom: number;
	get zoom(): number { return this.__zoom }
	set zoom(value: number) {
		Circuit.validZoom(value)
			&& (this.__zoom != value)
			&& (this.__zoom = value)
	}

	public static get zoomMultipliers(): number[] {
		return Array.from([8, 4, 2, 1, 0.75, 0.5, 0.33, 0.25, 0.166, 0.125]);
	}

	public static get zoomFactors(): string[] {
		return Array.from(["1/8X", "1/4X", "1/2X", "1X", "1 1/2X", "2X", "3X", "4X", "6X", "8X"]);
	}

	public static validZoom(zoom: number): boolean {
		return !(
			isNaN(zoom)
			|| !Circuit.zoomMultipliers.some(z => z == zoom)
		)
	}

	__modified: boolean;
	get modified(): boolean { return this.__modified }
	set modified(value: boolean) {
		if (value == this.__modified)
			return;
		this.__modified = value;
	}

	get ecList(): EC[] { return Array.from(this.ecMap.values()) }
	get wireList(): Wire[] { return Array.from(this.wireMap.values()) }
	get empty(): boolean { return !(this.wireMap.size || this.ecMap.size) }
	get components(): ItemBoard[] { return (this.ecList as ItemBoard[]).concat(this.wireList) }

	selectedComponents: EC[];
	filePath: string;
	view: Point;

	public get(id: string): EC | Wire | undefined {
		return this.ecMap.get(id) || this.wireMap.get(id)
	}

	get ec(): EC | undefined {
		return !this.selectedComponents.length ? void 0 : this.selectedComponents[0]
	}

	constructor(options: { name: string, zoom: number, version?: string, filePath?: string, description?: string }) {
		this.compMap = new Map();
		this.ecMap = new Map();
		this.wireMap = new Map();
		this.selectedComponents = [];
		this.uniqueCounters = {};
		this.version = options.version || "1.1.5";
		this.__zoom = Circuit.validZoom(options.zoom) ? options.zoom : Circuit.defaultZoom;
		this.name = options.name;
		this.description = <string>options.description;
		this.filePath = <string>options.filePath;
		this.__modified = false;
		this.view = new Point(0, 0);
	}

	public hasComponent(id: string): boolean { return this.ecMap.has(id); }

	public selectAll(value: boolean): EC[] {
		return (this.selectedComponents = Array.from((this as Circuit).ecMap.values())
			.filter(comp => (comp.select(value), value)))
	}

	public toggleSelect(comp: EC) {
		comp.select(!comp.selected);
		this.selectedComponents =
			this.ecList.filter(c => c.selected);
	}

	public selectThis(comp: EC): boolean {
		return comp
			&& (this.selectAll(false).push(comp.select(true) as EC), true)
	}

	public selectRect(rect: Rect) {
		(this.selectedComponents =
			this.ecList.filter((item) => {
				return rect.intersect(item.rect())
			}))
			.forEach(item => item.select(true));
	}

	public deleteSelected(): number {
		let
			deletedCount = 0;
		this.selectedComponents =
			this.selectedComponents.filter((c) => {
				if (this.delete(c)) {
					deletedCount++;
					return false;
				}
				return true;
			});
		return deletedCount
	}

	public delete(comp: ItemBoard): boolean {
		if (comp.type == Type.WIRE ?
			this.wireMap.delete(comp.id) :
			this.ecMap.delete(comp.id)
		) {
			comp.disconnect();
			comp.remove();
			this.modified = true;
			return true
		}
		return false
	}

	public add(options: { name: string, x: number, y: number, points: IPoint[] }): EC | Wire {
		let
			comp: EC | Wire;
		((name == "wire")
			&& (options.points = options.points, true))
			|| (options.x = options.x, options.y = options.y);
		comp = createBoardItem(this, options);
		this.modified = true;
		return <any>comp
	}

	// public static load(args: { filePath: string, data: string }): Circuit {
	// 	//check filePath & data

	// 	let circuit = new Circuit({
	// 		filePath: args.filePath,
	// 		name: "",
	// 		zoom: 0,
	// 		version: "",
	// 	});
	// 	parseCircuitXML(circuit, args.data);
	// 	return circuit;
	// }

	// public save(): Promise<boolean | string> {
	// 	let
	// 		that = this as Circuit;
	// 	return new Promise(function (resolve, reject) {
	// 		let
	// 			content = getCircuitXML(that);
	// 		if (that.filePath) {
	// 			fs.writeFileSync(that.filePath, content, 'utf-8');
	// 			that.modified = false;
	// 			resolve(true)
	// 		} else {
	// 			resolve(content);
	// 		}
	// 	})
	// }

	public destroy() {
		this.ecList.forEach(ec => this.delete(ec));
		this.wireList.forEach(wire => this.delete(wire));
		//maps should be empty here
		this.compMap = <any>void 0;
		this.ecMap = <any>void 0;
		this.wireMap = <any>void 0;
		this.selectedComponents = <any>void 0;
		this.__modified = false;
		this.filePath = <any>void 0;
	}

	public boundariesRect(): Rect {
		let
			components = this.components,
			first = components.shift(),
			r = first ? first.rect() : Rect.empty();
		components.forEach(ec => r.add(ec.rect()));
		r.grow(20, 20);
		return r;
	}
}

function createBoardItem(circuit: Circuit, options: any): EC | Wire {
	let
		regex = /(?:{([^}]+?)})+/g,
		name = options?.name || "",
		base = <IBaseComponent>circuit.rootComponent(name),
		newComp = !base,
		item: ItemBoard = <any>void 0;
	!base && (base = {
		comp: <Comp>Comp.find(name),
		count: 0
	});
	if (!base.comp)
		throw `unregistered component: ${name}`;
	newComp
		&& (base.count = base.comp.meta.countStart | 0, circuit.compMap.set(name, base));
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
							case "Circuit": return circuit.uniqueCounters;
						}
					},
					rootName = arr.shift() || "",
					rootRef = getRoot(rootName),
					prop: string = <any>arr.pop(),
					isUniqueCounter = () => rootName == "Circuit",
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
	switch (name) {
		case "wire":
			item = new Wire(circuit, options);
			if (circuit.wireMap.has(item.id))
				throw `duplicated id: ${item.id}`;
			circuit.wireMap.set(item.id, <Wire>item);
			break;
		default:
			!options.onProp && (options.onProp = function () {
				//this happens when this component is created...
			});
			item = new EC(circuit, options);
			if (circuit.ecMap.has(item.id))
				throw `duplicated id: ${item.id}`;
			circuit.ecMap.set(item.id, <EC>item);
			break;
	}
	return <any>item
}

// function parseCircuitXML(circuit: Circuit, data: string) {
// 	xml2js.parseString(data, {
// 		trim: true,
// 		explicitArray: false
// 	}, (err, json) => {
// 		if (err)
// 			console.log(err);
// 		else {
// 			let
// 				jsoncircuit = json.circuit || json.CIRCUIT,
// 				atttrs = jsoncircuit.$,
// 				getData = (value: any): any[] => {
// 					if (!value || (typeof value == "string"))
// 						return [];
// 					if (value.$)
// 						return [value]
// 					else
// 						return value;
// 				},
// 				getDataCompatibility = (group: string) => {
// 					switch (group) {
// 						case "ecs":
// 							return getData(jsoncircuit.ecs ? jsoncircuit.ecs.ec : jsoncircuit.ECS.EC);
// 						case "wires":
// 							return getData(jsoncircuit.wires ? jsoncircuit.wires.wire : jsoncircuit.WIRES.WIRE);
// 						case "bonds":
// 							return getData(jsoncircuit.bonds ? jsoncircuit.bonds.bond : jsoncircuit.BONDS.BOND);
// 					}
// 					return [];
// 				},
// 				ECS = getDataCompatibility("ecs"),
// 				WIRES = getDataCompatibility("wires"),
// 				BONDS = getDataCompatibility("bonds"),
// 				view = (atttrs.view || "").split(',');
// 			//attributes
// 			circuit.version = atttrs.version;
// 			!Circuit.validZoom(circuit.zoom = parseFloat(atttrs.zoom))
// 				&& (circuit.zoom = Circuit.defaultZoom);
// 			circuit.name = atttrs.name;
// 			circuit.description = atttrs.description;
// 			circuit.view = new Point(parseInt(view[0]) | 0, parseInt(view[1]) | 0);
// 			//create ECs
// 			ECS.forEach((xml: { $: { id: string, name: string, x: string, y: string, rot: string, label: string } }) => {
// 				<EC>createBoardItem(circuit, {
// 					id: xml.$.id,
// 					name: xml.$.name,
// 					x: parseInt(xml.$.x),
// 					y: parseInt(xml.$.y),
// 					rotation: parseInt(xml.$.rot),
// 					label: xml.$.label,
// 				});
// 			})
// 			WIRES.forEach((xml: { $: { id: string, points: string, label: string } }) => {
// 				let
// 					options = {
// 						id: xml.$.id,
// 						name: "wire",
// 						label: xml.$.label,
// 						points: xml.$.points.split('|').map(s => Point.parse(s)),
// 					};
// 				if (options.points.some(p => !p))
// 					throw `invalid wire points`;
// 				<Wire>createBoardItem(circuit, options);
// 			})
// 			BONDS.forEach((s: string) => {
// 				let
// 					arr = s.split(','),
// 					fromIt = <ItemBoard>circuit.get(<string>arr.shift()),
// 					fromNdx = parseInt(<string>arr.shift()),
// 					toIt = <ItemBoard>circuit.get(<string>arr.shift()),
// 					toNdx = parseInt(<string>arr.shift());
// 				if (arr.length || !fromIt || !toIt || !fromIt.getNode(fromNdx) || !toIt.getNode(toNdx))
// 					throw `invalid bond`;
// 				fromIt.bond(fromNdx, toIt, toNdx);
// 			})
// 		}
// 	})
// }

function getAllCircuitBonds(circuit: Circuit): string[] {
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
	circuit.components
		.forEach(comp => comp.bonds.forEach(findBonds));
	return bonds;
}

function getCircuitXML(circuit: Circuit): string {
	return '<?xml version="1.0" encoding="utf-8"?>\n'
		+ Templates.parse('circuitXml', {
			version: circuit.version,
			name: circuit.name,
			zoom: circuit.zoom,
			description: circuit.description,
			view: circuit.view,
			ecList: circuit.ecList,
			wireList: circuit.wireList.map(w => ({
				id: w.id,
				label: w.label,
				points: w.points.map(p => Templates.nano('simplePoint', p))
					.join('|')
			})),
			bonds: getAllCircuitBonds(circuit)
		},
			true)
}