import { obj, copy } from "./dab";
import Point from './point';
import Comp from "./components";
import { UIProp } from "./props";
import Label from "./label";
import Container from "./container";
import FlowchartComp from "./flowchartComp";
import EC from "./ec";
import ItemBoard from "./itemsBoard";
import Bond from "./bonds";
import Wire from "./wire";
import Board from "./board";


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

	protected __s: { [x: string]: any };

	constructor(options?: { [x: string]: any; }) {
		this.clear(options);
	}

	public clear(options?: { [x: string]: any; }): void {
		this.__s = obj(copy(this.defaults(), options || {}));
	}

	abstract defaults(): { [x: string]: any; };

}

export interface IBoardOptions {
	containers?: Container<EC | FlowchartComp>[];
	onModified?: (value: boolean) => void;
}

export interface IBoardDefaults extends IBoardOptions {
	modified: boolean;
	containers: Container<EC | FlowchartComp>[];
}

export interface IContainerDefaults<T extends ItemBoard> {
	name: string;
	board: Board;
	counters: { [x: string]: any; };
	components: Map<string, IBaseComponent>;
	itemMap: Map<string, { t: T, b: Bond[], c: number }>;
	wireMap: Map<string, { t: Wire, b: Bond[], c: number }>;
	selected: (T | Wire)[];
	modified: boolean;
}

//***************************************** General ************************************//

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

export interface IComponentProperty {
	name: string;
	value: string | number | any;
	valueType: string;
	type: string;
	isProperty: boolean;
	readonly: boolean;
	label: string;
	class: string;
	options?: string[];

	//this's for EC properties like this.p show in property window
	//ec: ItemBoard;
	setValue(val: string): boolean;
}

export type ComponentPropertyType = string | number | IComponentProperty;

//***************************************** UIProperty ************************************//

export interface IDisposable {
	dispose(): void;
}

export interface IReactProp extends IDisposable {
	value: any;
	onChange?: IUIPropertyCallback | undefined;
	data: { [id: string]: any };
}

export interface IUIPropertyCallback {
	(value: any, where: number, prop: IReactProp, e: any): any | void;
}

export interface IReactPropDefaults {
	data: { [id: string]: any };
	value: any;
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
	root: { [id: string]: { value: any, prop: UIProp, modified: boolean } };
	modified: boolean;
}


//***************************************** Component ************************************//
export interface IComponentOptions {
	library: string;
	type: string;
	name: string;
	properties: { [x: string]: any };
	data: string;
	meta: IComponentMetadata;
	tmpl: IComponentTemplate;
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
	comp: Comp;
}

export interface IBaseComponent {
	count: number;
	comp: Comp;
}

//***************************************** Item ************************************//

//Item, BoardItem, Wire, ED, Label,...
export interface IItemDefaults {
	id: string;
	name: string;
	x: number;
	y: number;
	class: string;
	visible: boolean;
	label: string;
	base: Comp;

}
export interface IItemBaseDefaults extends IItemDefaults {
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

export interface IItemBoardDefaults extends IItemBaseDefaults {
	props: { [x: string]: any };
	selected: boolean;
	onProp: Function;
	directional: boolean;
}

export interface IItemSolidDefaults extends IItemBoardDefaults {
	rotation: number;
}

export interface IWireDefaults extends IItemBoardDefaults {
	points: Point[];
	polyline: SVGElement;
	lines: SVGElement[];		//used on edit-mode only
	edit: boolean;
}

export interface IECDefaults extends IItemSolidDefaults {
	boardLabel: Label;
}

export interface IHighlightable {
	visible: boolean;
	p: Point;
	radius: number;
	g: SVGCircleElement;

	nodeName: string;
	nodeValue: number;

	move(x: number, y: number): void;
	hide(): IHighlightable;
	show(nodeValue: number): IHighlightable;
	refresh(): void;
	setRadius(value: number): IHighlightable;
}

//***************************************** Bonds ************************************//

export interface IBondNode {
	id: string;
	type: Type;
	ndx: number;
}
