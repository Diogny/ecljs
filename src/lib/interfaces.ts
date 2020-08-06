import { obj, copy } from "./dab";
import Point from './point';
import Comp from "./components";
import UIProp from "./props";
import Label from "./label";
import Container from "./container";
import FlowchartComponent from "./flowchartComponent";
import EC from "./ec";
import ItemBoard from "./itemsBoard";
import Bond from "./bonds";
import Wire from "./wire";
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

export interface IBaseSettings {
	propertyDefaults(): { [x: string]: any };
}

export abstract class BaseSettings implements IBaseSettings {

	protected settings: { [x: string]: any };

	constructor(options: { [x: string]: any; }) {
		this.settings = obj(copy(this.propertyDefaults(), options));
	}

	propertyDefaults(): { [x: string]: any; } {
		return {}
	}

}

export interface IBoardOptions {
	name: string;
	description?: string;
	zoom?: number;
	filePath?: string;
}

export interface IBoardProperties {
	version: string;
	name: string;
	description: string;
	filePath: string;
	viewBox: Rect;
	zoom: number;
	containers: Container<EC | FlowchartComponent>[]
}

export interface IContainerProperties<T extends ItemBoard> {
	uniqueCounters: { [x: string]: any; };
	componentTemplates: Map<string, IBaseComponent>;
	itemMap: Map<string, { c: T, b: Bond[] }>;
	wireMap: Map<string, { c: Wire, b: Bond[] }>;
	selected: T[];
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

export interface IUIPropertyCallback {
	(value: number | boolean | string | string[], where: number, prop: UIProp, e: any): void;
}

export interface IUIPropertyOptions {
	tag: string | Element;
	onChange?: IUIPropertyCallback | undefined;
	toStringFn?: () => string;
}

export interface IUIProperty extends IUIPropertyOptions {
	id: string;
	name: string;
	type: string;
	html: HTMLElement;
	editable: boolean;
	nodeName: string;
	value: number | boolean | string | string[];
}

export interface IUIPropertySettings extends IUIProperty {
	getter: string;
	htmlSelect: boolean;
	selectCount: number;
	selectMultiple: boolean;
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
	list: IMetadataNodeInfo[];
}

export interface IMetadataNodeInfo extends IPoint {
	label: string;
}

export interface IItemNode extends IMetadataNodeInfo {
	rot: IPoint;
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
export interface IItemBaseOptions {
	id: string;
	name: string;
	x: number;
	y: number;
	class: string;
	visible: boolean;
	label: string;
	base: Comp;
	//color: string;
}

export interface IItemWireOptions extends IItemBaseOptions {
	points: IPoint[];
}

export interface IItemSolidOptions extends IItemBaseOptions {
	rotation: number;
	onProp: Function;
}

export interface ILabelText extends IItemBaseOptions {
	fontSize: number;
}

export interface ITooltipText extends ILabelText {
	borderRadius: number;
}

//the object item base has all properties, but restricted in the constructor
export interface IItemBaseProperties extends IItemBaseOptions {
	props: { [x: string]: any };
	g: SVGElement;
}

export interface ITooltipSettings extends IItemBaseProperties {
	fontSize: number;
	borderRadius: number;
}

export interface IHighlighNodeSettings extends IItemBaseProperties {
	radius: number;
	//these're the current selected node properties
	selectedId: string;
	selectedNode: number;
}

export interface IItemBoardProperties extends IItemBaseProperties {
	selected: boolean;
	onProp: Function;
	directional: boolean;
}

export interface IItemSolidProperties extends IItemBoardProperties {
	rotation: number;
}

export interface IWireProperties extends IItemBoardProperties {
	points: Point[];
	polyline: SVGElement;
	lines: SVGElement[];		//used on edit-mode only
	pad: number;
	edit: boolean;
}

export interface IECProperties extends IItemSolidProperties {
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

export interface IBondLink {
	id: string;
	type: Type;
	ndx: number;
}
