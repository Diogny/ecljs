"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const ec_1 = tslib_1.__importDefault(require("./ec"));
const wire_1 = tslib_1.__importDefault(require("./wire"));
const types_1 = require("./types");
const rect_1 = tslib_1.__importDefault(require("./rect"));
const dab_1 = require("./dab");
const point_1 = tslib_1.__importDefault(require("./point"));
const components_1 = tslib_1.__importDefault(require("./components"));
const templates_1 = require("./templates");
class Circuit {
    constructor(options) {
        this.compMap = new Map();
        this.ecMap = new Map();
        this.wireMap = new Map();
        this.selectedComponents = [];
        this.uniqueCounters = {};
        this.version = options.version || "1.1.5";
        this.__zoom = Circuit.validZoom(options.zoom) ? options.zoom : Circuit.defaultZoom;
        this.name = options.name;
        this.description = options.description;
        this.filePath = options.filePath;
        this.__modified = false;
        this.view = new point_1.default(0, 0);
    }
    rootComponent(name) {
        return this.compMap.get(name);
    }
    get zoom() { return this.__zoom; }
    set zoom(value) {
        Circuit.validZoom(value)
            && (this.__zoom != value)
            && (this.__zoom = value);
    }
    static get zoomMultipliers() {
        return Array.from([8, 4, 2, 1, 0.75, 0.5, 0.33, 0.25, 0.166, 0.125]);
    }
    static get zoomFactors() {
        return Array.from(["1/8X", "1/4X", "1/2X", "1X", "1 1/2X", "2X", "3X", "4X", "6X", "8X"]);
    }
    static validZoom(zoom) {
        return !(isNaN(zoom)
            || !Circuit.zoomMultipliers.some(z => z == zoom));
    }
    get modified() { return this.__modified; }
    set modified(value) {
        if (value == this.__modified)
            return;
        this.__modified = value;
    }
    get ecList() { return Array.from(this.ecMap.values()); }
    get wireList() { return Array.from(this.wireMap.values()); }
    get empty() { return !(this.wireMap.size || this.ecMap.size); }
    get components() { return this.ecList.concat(this.wireList); }
    get(id) {
        return this.ecMap.get(id) || this.wireMap.get(id);
    }
    get ec() {
        return !this.selectedComponents.length ? void 0 : this.selectedComponents[0];
    }
    hasComponent(id) { return this.ecMap.has(id); }
    selectAll(value) {
        return (this.selectedComponents = Array.from(this.ecMap.values())
            .filter(comp => (comp.select(value), value)));
    }
    toggleSelect(comp) {
        comp.select(!comp.selected);
        this.selectedComponents =
            this.ecList.filter(c => c.selected);
    }
    selectThis(comp) {
        return comp
            && (this.selectAll(false).push(comp.select(true)), true);
    }
    selectRect(rect) {
        (this.selectedComponents =
            this.ecList.filter((item) => {
                return rect.intersect(item.rect());
            }))
            .forEach(item => item.select(true));
    }
    deleteSelected() {
        let deletedCount = 0;
        this.selectedComponents =
            this.selectedComponents.filter((c) => {
                if (this.delete(c)) {
                    deletedCount++;
                    return false;
                }
                return true;
            });
        return deletedCount;
    }
    delete(comp) {
        if (comp.type == types_1.Type.WIRE ?
            this.wireMap.delete(comp.id) :
            this.ecMap.delete(comp.id)) {
            comp.disconnect();
            comp.remove();
            this.modified = true;
            return true;
        }
        return false;
    }
    add(options) {
        let comp;
        ((name == "wire")
            && (options.points = options.points, true))
            || (options.x = options.x, options.y = options.y);
        comp = createBoardItem(this, options);
        this.modified = true;
        return comp;
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
    destroy() {
        this.ecList.forEach(ec => this.delete(ec));
        this.wireList.forEach(wire => this.delete(wire));
        //maps should be empty here
        this.compMap = void 0;
        this.ecMap = void 0;
        this.wireMap = void 0;
        this.selectedComponents = void 0;
        this.__modified = false;
        this.filePath = void 0;
    }
    boundariesRect() {
        let components = this.components, first = components.shift(), r = first ? first.rect() : rect_1.default.empty();
        components.forEach(ec => r.add(ec.rect()));
        r.grow(20, 20);
        return r;
    }
}
exports.default = Circuit;
Circuit.defaultZoom = 0.5; // 2X
function createBoardItem(circuit, options) {
    let regex = /(?:{([^}]+?)})+/g, name = (options === null || options === void 0 ? void 0 : options.name) || "", base = circuit.rootComponent(name), newComp = !base, item = void 0;
    !base && (base = {
        comp: components_1.default.find(name),
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
    let label = base.comp.meta.nameTmpl.replace(regex, function (match, group) {
        let arr = group.split('.'), getRoot = (name) => {
            //valid entry points
            switch (name) {
                case "base": return base;
                case "Circuit": return circuit.uniqueCounters;
            }
        }, rootName = arr.shift() || "", rootRef = getRoot(rootName), prop = arr.pop(), isUniqueCounter = () => rootName == "Circuit", result;
        while (rootRef && arr.length)
            rootRef = rootRef[arr.shift()];
        if (rootRef == undefined
            || ((result = rootRef[prop]) == undefined
                && (!isUniqueCounter()
                    || (result = rootRef[prop] = base.comp.meta.countStart | 0, false))))
            throw `invalid label template`;
        isUniqueCounter()
            && dab_1.isNum(result)
            && (rootRef[prop] = result + 1);
        return result;
    });
    if (options.label && label != options.label)
        throw `invalid label`;
    else
        options.label = label;
    base.count++;
    switch (name) {
        case "wire":
            item = new wire_1.default(circuit, options);
            if (circuit.wireMap.has(item.id))
                throw `duplicated id: ${item.id}`;
            circuit.wireMap.set(item.id, item);
            break;
        default:
            !options.onProp && (options.onProp = function () {
                //this happens when this component is created...
            });
            item = new ec_1.default(circuit, options);
            if (circuit.ecMap.has(item.id))
                throw `duplicated id: ${item.id}`;
            circuit.ecMap.set(item.id, item);
            break;
    }
    return item;
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
function getAllCircuitBonds(circuit) {
    let bonds = [], keyDict = new Set(), findBonds = (bond) => {
        let fromId = bond.from.id, fromNdx = bond.from.ndx, keyRoot = `${fromId},${fromNdx}`;
        bond.to.forEach(b => {
            let otherRoot = `${b.id},${b.ndx}`, key0 = `${keyRoot},${otherRoot}`;
            if (!keyDict.has(key0)) {
                keyDict.add(key0).add(`${otherRoot},${keyRoot}`);
                bonds.push(key0);
            }
        });
    };
    circuit.components
        .forEach(comp => comp.bonds.forEach(findBonds));
    return bonds;
}
function getCircuitXML(circuit) {
    return '<?xml version="1.0" encoding="utf-8"?>\n'
        + templates_1.Templates.parse('circuitXml', {
            version: circuit.version,
            name: circuit.name,
            zoom: circuit.zoom,
            description: circuit.description,
            view: circuit.view,
            ecList: circuit.ecList,
            wireList: circuit.wireList.map(w => ({
                id: w.id,
                label: w.label,
                points: w.points.map(p => templates_1.Templates.nano('simplePoint', p))
                    .join('|')
            })),
            bonds: getAllCircuitBonds(circuit)
        }, true);
}
