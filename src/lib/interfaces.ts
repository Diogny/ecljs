import { obj, copy } from "./dab";
import Point from './point';
import { ReactProp } from "./props";
import Label from "./label";
import ItemBoard from "./itemsBoard";
import Bond from "./bonds";
import Wire from "./wire";
import CompNode from "./compNode";
import CompStore from "./components";
import Size from "./size";
import Unit from "./units";
import Rect from "./rect";


//***************************************** Types ************************************//

export enum Type {
	UNDEFINED = 0,
	EC = 1,
	WIRE = 2,
	BOND = 3,
	LABEL = 4,
	WIN = 5,
	TOOLTIP = 6,
	HIGHLIGHT = 7,
	FLOWCHART = 8
};

export interface IType {
	type: Type;
}

export interface IBase {
	defaults(): { [x: string]: any };
}

export abstract class Base implements IBase {

	/**
	 * internal property object. hides somehow from outside so I don't get a huge amount of properties visible
	 */
	protected $: { [x: string]: any };

	/**
	 * 
	 * @param options [key]::value object with default values
	 * 
	 * note:
	 * 
	 * Only keys inside defaults() object will be copied to the internal object
	 */
	constructor(options?: { [x: string]: any; }) {
		this.clear(options);
	}

	/**
	 * 
	 * @param options [key]::value options to be copied internally
	 */
	protected clear(options?: { [x: string]: any; }): void {
		this.$ = obj(copy(this.defaults(), options || {}));
	}

	/**
	 * @description class property defaults. Only these keys are copied internally
	 */
	abstract defaults(): { [x: string]: any; };

}

export interface IContainerDefaults<T extends ItemBoard> {
	//name: string;
	//board: Board;
	store: CompStore;
	counters: { [x: string]: any; };
	components: Map<string, IBaseComponent>;
	itemMap: Map<string, { t: T, b: Bond[], c: number }>;
	wireMap: Map<string, { t: Wire, b: Bond[], c: number }>;
	selected: (T | Wire)[];
}

//***************************************** General ************************************//

export type IEqual = (p: Point | Size | Rect | Unit) => boolean;

export interface IPoint {
	x: number;
	y: number;
}

export interface ISize {
	width: number;
	height: number;
}

export interface IRect extends IPoint, ISize { }

//***************************************** Component Property ************************************//

export interface IPropHookProp {
	/**
	* value
	*/
	value: any; //number | string | Size | Point | Unit | Rect;
	/**
	 * number | string | size | point | rect | unit
	 */
	valueType: string;
}
export type IPropHookPropType = string | number | IPropHookProp;

export interface IComponentProperty extends IPropHookProp {
	/**
	 * input, select, string, number
	 */
	type: string;
	/**
	 * options when type is select
	 */
	options?: string[];
	readonly: boolean;
}

export type ComponentPropertyType = string | number | IComponentProperty;

//***************************************** UIProperty ************************************//

export interface IDisposable {
	dispose(): void;
}

export interface IReactProp extends IDisposable {
	value: any;
	onChange?: IUIPropertyCallback | undefined;
	_: { [id: string]: any };
}

export interface IUIPropertyCallback {
	(value: any, where: number, prop: IReactProp, e: any): any | void;
}

export interface IReactPropDefaults {
	_: { [id: string]: any };
	value: any;
}

export interface IPropHook {
	value: any;
	modified: boolean;
}

export interface IReactPropHook extends IPropHook {
	name: string;
	prop: ReactProp;
	_: { [id: string]: any };
}

export interface IUIPropertyDefaults extends IReactPropDefaults {
	tag: string | Element;
	type: string;
	html: HTMLElement;
	editable: boolean;
	getter: string;
	htmlSelect: boolean;
	selectCount: number;
	selectMultiple: boolean;
}


export interface IPropContainerDefaults {
	_: { [id: string]: IReactPropHook };
	modified: boolean;
}


//***************************************** Component ************************************//

export interface IComponent {
	type: string;
	name: string;
	props: { [x: string]: ComponentPropertyType };
	data: string;
	meta: IComponentMetadata;
}

export interface IComponentOptions extends IComponent {
	tmpl: IComponentTemplate;
}

export interface ILibrary {
	type: string;
	/**
	 * library name: circuit, flowchart
	 */
	name: string;
	version: string;
	list: IComponentOptions[];
}

//meta
export interface IComponentMetadata {
	class: string;
	countStart: number;	//for non-global count
	nameTmpl: string;
	labelId: IPoint;
	nodes: IMetadataNodes;
	logic: IMetadataLogic;
	label: IComponentTemplateLabel;
	//createNodeLabels: boolean;
}

export interface IFlowchartMetadata extends IComponentMetadata {
	inputs: number;
	outputs: number;
	/**
	 * "width, height"
	 */
	size: string;
	fontSize: number;
	text: string;
	/**
	 * "x, y"
	 */
	position: string;
}

export interface IMetadataNodes {
	//length: number;
	//size: ISize;
	createLabels: boolean;
	list: INodeInfo[];
}

export interface INodeInfo extends IPoint {
	label: string;
}

export interface IMetadataLogic {
	header: string[];
	table: string[][];
}

//tmpl
export interface IComponentTemplate {
	name: string;
	label: IComponentTemplateLabel;
	nodeLabels: string[];
}

export interface IComponentTemplateLabel {
	x: number;
	y: number;
	class: string;
	text: string;
}

//
export interface IBaseStoreComponent {
	name: string,
	comp: IComponent;
}

export interface IBaseComponent {
	count: number;
	comp: IComponent;
}

//***************************************** Item ************************************//

//Item, BoardItem, Wire, ED, Label,...
export interface IItemDefaults {
	id: string;
	name: string;
	x: number;
	y: number;
	visible: boolean;
	class: string;
}

export interface IItemBaseDefaults extends IItemDefaults {
	base: IComponent;
	g: SVGElement;
}

export interface IBaseLabelDefaults extends IItemBaseDefaults {
	fontSize: number;
}

export interface ILabelDefaults extends IBaseLabelDefaults {
	svgtext: SVGTextElement;
	text: string;
}

export interface ITooltipDefaults extends ILabelDefaults {
	borderRadius: number;
	svgrect: SVGRectElement;
	gap: number;
}

export interface IHighlighNodeDefaults extends IItemBaseDefaults {
	radius: number;
	mainNode: SVGCircleElement;
	//these're the current selected node properties
	selectedId: string;
	selectedNode: number;
}

export interface IItemBoardPropEvent {
	id: string;
	code: number;
	$?: { [id: string]: any };
}

export interface IItemBoardDefaults extends IItemBaseDefaults {
	props: { [x: string]: ComponentPropertyType };
	selected: boolean;
	onProp: (args: IItemBoardPropEvent) => void;
	dir: boolean;
	highlights: { [node: number]: CompNode };
}

export interface IWireDefaults extends IItemBoardDefaults {
	points: Point[];
	poly: SVGPolylineElement;
	arrow: SVGPolylineElement;
	head: number;
	lines: SVGLineElement[];		//used on edit-mode only
	edit: boolean;
}

export interface IItemSolidDefaults extends IItemBoardDefaults {
	/**
	 * rotation in 45° (+/-) increments until 360° goes back to 0°
	 */
	rot: number;
}

export interface IECDefaults extends IItemSolidDefaults {
	boardLabel: Label;
}

export interface IFlowChartDefaults extends IItemSolidDefaults {
	size: Size;
	ins: number;
	outs: number;
	fontSize: number;
	text: string;
	svgText: SVGTextElement;
	pos: Point;
	onResize: (size: Size) => void;
}

export interface IFlowProcessDefaults extends IFlowChartDefaults {
	rect: SVGRectElement;
}

export interface IFlowCondDefaults extends IFlowChartDefaults {
	path: SVGPathElement;
}

export interface IBoardCircleDefaults extends IItemDefaults {
	radius: number;
	node: number;
	label: string;
	g: SVGCircleElement;
}

//***************************************** Bonds ************************************//

export interface IBondNode {
	id: string;
	type: Type;
	ndx: number;
}

/**
 * @description direction of the bond.
 * 
 * - 0 - origin bond. this's the start of EC | FlowComp or Wire node bond
 * - 1 - dest bond. this's the way back in this bond relationship
 */
export type BondDir = 0 | 1;