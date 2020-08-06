"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var templates_1 = require("./templates");
var ec_1 = tslib_1.__importDefault(require("./ec"));
// import * as xml2js from 'xml2js';
// import * as fs from 'fs';
var container_1 = tslib_1.__importDefault(require("./container"));
var Circuit = /** @class */ (function (_super) {
    tslib_1.__extends(Circuit, _super);
    function Circuit() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Circuit.prototype, "name", {
        get: function () { return "Circuit"; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Circuit.prototype, "library", {
        get: function () { return "circuit"; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Circuit.prototype, "directionalWires", {
        get: function () { return false; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Circuit.prototype, "ec", {
        get: function () {
            return !this.selected.length ? void 0 : this.selected[0];
        },
        enumerable: false,
        configurable: true
    });
    Circuit.prototype.createItem = function (options) {
        return new ec_1.default(this, options);
    };
    Circuit.prototype.getXML = function () {
        return '<?xml version="1.0" encoding="utf-8"?>\n'
            + templates_1.Templates.parse('circuitXml', {
                itemList: this.components,
                wireList: this.wires.map(function (w) { return ({
                    id: w.id,
                    label: w.label,
                    points: w.points.map(function (p) { return templates_1.Templates.nano('simplePoint', p); })
                        .join('|')
                }); }),
                bonds: this.getAllBonds()
            }, true);
    };
    return Circuit;
}(container_1.default));
exports.default = Circuit;
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
