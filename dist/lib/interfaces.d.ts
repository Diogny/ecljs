import Comp from "./components";
import Bond from "./bonds";
import { Type } from "./types";
import Point from './point';
export interface IPoint {
    x: number;
    y: number;
}
export interface ISize {
    width: number;
    height: number;
}
export interface IRect extends IPoint, ISize {
}
export interface IComponentOptions {
    type: string;
    name: string;
    properties: any;
    data: string;
    meta: IComponentMetadata;
    tmpl: IComponentTemplate;
}
export interface IComponentMetadata {
    class: string;
    countStart: number;
    nameTmpl: string;
    labelId: IPoint;
    nodes: IMetadataNodes;
    logic: IMetadataLogic;
    label: IComponentTemplateLabel;
}
export interface IMetadataNodes {
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
export interface IBaseStoreComponent {
    name: string;
    comp: Comp;
}
export interface IBaseComponent {
    count: number;
    comp: Comp;
}
export interface IItemBaseOptions {
    id: string;
    name: string;
    x: number;
    y: number;
    class: string;
    visible: boolean;
    label: string;
    base: Comp;
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
export interface IItemBaseProperties extends IItemBaseOptions {
    g: SVGElement;
}
export interface ITooltipSettings extends IItemBaseOptions {
    g: SVGElement;
    fontSize: number;
    borderRadius: number;
}
export interface IHighlighNodeSettings extends IItemBaseOptions {
    g: SVGElement;
    radius: number;
    selectedId: string;
    selectedNode: number;
}
export interface IItemBoardProperties extends IItemBaseProperties {
    props: any;
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
    lines: SVGElement[];
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
export interface IBondItem {
    id: string;
    type: Type;
    ndx: number;
}
