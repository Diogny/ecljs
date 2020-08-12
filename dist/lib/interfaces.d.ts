import Point from './point';
import Comp from "./components";
import { ReactProp } from "./props";
import Label from "./label";
import ItemBoard from "./itemsBoard";
import Bond from "./bonds";
import Wire from "./wire";
import Board from "./board";
export declare enum Type {
    UNDEFINED = 0,
    EC = 1,
    WIRE = 2,
    BOND = 3,
    LABEL = 4,
    WIN = 5,
    TOOLTIP = 6,
    HIGHLIGHT = 7,
    FLOWCHART = 8
}
export interface IType {
    type: Type;
}
export interface IBase {
    defaults(): {
        [x: string]: any;
    };
}
export declare abstract class Base implements IBase {
    protected __s: {
        [x: string]: any;
    };
    constructor(options?: {
        [x: string]: any;
    });
    clear(options?: {
        [x: string]: any;
    }): void;
    abstract defaults(): {
        [x: string]: any;
    };
}
export interface IContainerDefaults<T extends ItemBoard> {
    name: string;
    board: Board;
    counters: {
        [x: string]: any;
    };
    components: Map<string, IBaseComponent>;
    itemMap: Map<string, {
        t: T;
        b: Bond[];
        c: number;
    }>;
    wireMap: Map<string, {
        t: Wire;
        b: Bond[];
        c: number;
    }>;
    selected: (T | Wire)[];
}
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
    setValue(val: string): boolean;
}
export declare type ComponentPropertyType = string | number | IComponentProperty;
export interface IDisposable {
    dispose(): void;
}
export interface IReactProp extends IDisposable {
    value: any;
    onChange?: IUIPropertyCallback | undefined;
    data: {
        [id: string]: any;
    };
}
export interface IUIPropertyCallback {
    (value: any, where: number, prop: IReactProp, e: any): any | void;
}
export interface IPropHook {
    name: string;
    value: any;
    prop: ReactProp;
    modified: boolean;
}
export interface IReactPropDefaults {
    data: {
        [id: string]: any;
    };
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
    root: {
        [id: string]: IPropHook;
    };
    modified: boolean;
}
export interface IComponentOptions {
    library: string;
    type: string;
    name: string;
    properties: {
        [x: string]: any;
    };
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
    list: INodeInfo[];
}
export interface INodeInfo extends IPoint {
    label: string;
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
    selectedId: string;
    selectedNode: number;
}
export interface IItemBoardDefaults extends IItemBaseDefaults {
    props: {
        [x: string]: any;
    };
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
    lines: SVGElement[];
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
export interface IBondNode {
    id: string;
    type: Type;
    ndx: number;
}
