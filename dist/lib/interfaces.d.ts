import Point from './point';
import Comp from "./components";
import UIProp from "./props";
import Label from "./label";
import Container from "./container";
import FlowchartComp from "./flowchartComp";
import EC from "./ec";
import ItemBoard from "./itemsBoard";
import Bond from "./bonds";
import Wire from "./wire";
import Rect from "./rect";
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
export interface IBaseSettings {
    defaults(): {
        [x: string]: any;
    };
}
export declare abstract class Base implements IBaseSettings {
    protected __s: {
        [x: string]: any;
    };
    constructor(options: {
        [x: string]: any;
    });
    clear(options?: {
        [x: string]: any;
    }): void;
    defaults(): {
        [x: string]: any;
    };
}
export interface IBoardOptions {
    version?: string;
    name: string;
    description?: string;
    filePath?: string;
    viewPoint?: Point;
    containers?: Container<EC | FlowchartComp>[];
    onZoom?: (zoom: number) => void;
    onModified?: (value: boolean) => void;
}
export interface IBoardProperties {
    version: string;
    name: string;
    description: string;
    filePath: string;
    viewBox: Rect;
    zoom: number;
    modified: boolean;
    containers: Container<EC | FlowchartComp>[];
    onZoom?: (zoom: number) => void;
    onModified?: (value: boolean) => void;
}
export interface IContainerProperties<T extends ItemBoard> {
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
    modified: boolean;
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
    props: {
        [x: string]: any;
    };
    g: SVGElement;
}
export interface ITooltipSettings extends IItemBaseProperties {
    fontSize: number;
    borderRadius: number;
}
export interface IHighlighNodeSettings extends IItemBaseProperties {
    radius: number;
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
    lines: SVGElement[];
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
export interface IBondLink {
    id: string;
    type: Type;
    ndx: number;
}
