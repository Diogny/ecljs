import { IPoint } from "./interfaces";
import { Templates } from "./templates";
import EC from "./ec";
// import * as xml2js from 'xml2js';
// import * as fs from 'fs';
import Container from "./container";

export default class Circuit extends Container<EC> {

	get name(): string { return "Circuit" }
	get library(): string { return "circuit" }
	get directionalWires(): boolean { return false }

	get ec(): EC | undefined {
		return !this.selected.length ? void 0 : <EC>this.selected[0]
	}

	public createItem(options: { name: string, x: number, y: number, points: IPoint[] }): EC {
		return new EC(this, <any>options);
	}

	public getXML(): string {
		return '<?xml version="1.0" encoding="utf-8"?>\n'
			+ Templates.parse('circuitXml', {
				itemList: this.components,
				wireList: this.wires.map(w => ({
					id: w.id,
					label: w.label,
					points: w.points.map(p => Templates.nano('simplePoint', p))
						.join('|')
				})),
				bonds: this.getAllBonds()
			},
				true)
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
