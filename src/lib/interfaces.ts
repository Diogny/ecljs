import Comp from "./components";
import Bond from "./bonds";
import { Type } from "./types";
import Point from './point';
import UIProp from "./props";

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
	value: string;
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
	bonds: Bond[];
	bondsCount: number;
}

export interface IItemSolidProperties extends IItemBoardProperties {
	rotation: number;
}

export interface IWireProperties extends IItemSolidProperties {
	points: Point[];
	polyline: SVGElement;
	lines: SVGElement[];		//used on edit-mode only
	pad: number;
	edit: boolean;
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

export interface IBondItem {
	id: string;
	type: Type;
	ndx: number;
}
