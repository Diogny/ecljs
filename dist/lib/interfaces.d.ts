import { IPoint } from "dabbjs/dist/lib/interfaces";
import { Point } from 'dabbjs/dist/lib/point';
import { Size } from "dabbjs/dist/lib/size";
import { Rect } from "dabbjs/dist/lib/rect";
import Unit from "electric-units/dist/units";
import { ReactProp } from "./props";
import { Label } from "./label";
import { ItemBoard } from "./itemsBoard";
import { Bond } from "./bonds";
import { Wire } from "./wire";
import { CompStore } from "./components";
import { ConditionalLabel } from "./flowCondLabel";
import { FlowComp } from "./flowComp";
export declare enum Type {
    /**
     * Undefined/unknown type
     */
    NONE = 0,
    /**
     * Electric Circuit Component
     */
    EC = 1,
    /**
     * Wire, can be directional/arrow
     */
    WIRE = 2,
    /**
     * Component bond
     */
    BOND = 3,
    /**
     * Text Label on the board
     */
    LABEL = 4,
    /**
     * HTML window on the board
     */
    WIN = 5,
    /**
     * Tooltip text label
     */
    TOOLTIP = 6,
    /**
     * HighLight
     */
    HL = 7,
    /**
     * Flowchart resizable component
     */
    FL = 8,
    /**
     * UI Widget
     */
    WIDGET = 9
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
    /**
     * internal property object. hides somehow from outside so I don't get a huge amount of properties visible
     */
    protected $: {
        [x: string]: any;
    };
    /**
     *
     * @param options [key]::value object with default values
     *
     * note:
     *
     * Only keys inside defaults() object will be copied to the internal object
     */
    constructor(options?: {
        [x: string]: any;
    });
    /**
     *
     * @param options [key]::value options to be copied internally
     */
    protected clear(options?: {
        [x: string]: any;
    }): void;
    /**
     * @description class property defaults. Only these keys are copied internally
     */
    abstract defaults(): {
        [x: string]: any;
    };
}
export type ContainerMapType<T extends ItemBoard> = {
    t: T;
    b: Bond[];
    c: number;
};
export interface IContainerDefaults<T extends ItemBoard> {
    store: CompStore;
    counters: {
        [x: string]: number;
    };
    components: Map<string, IBaseComponent>;
    itemMap: Map<string, ContainerMapType<T>>;
    wireMap: Map<string, ContainerMapType<Wire>>;
    selected: (T | Wire)[];
}
export type IFlowResizePolicy = "grow" | "expand";
export interface IFlowchartDefaults extends IContainerDefaults<FlowComp> {
    reSizePolicy: IFlowResizePolicy;
}
export type IEqual = (p: Point | Size | Rect | Unit) => boolean;
export interface IPropHookProp {
    /**
    * value
    */
    value: any;
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
export interface IDisposable {
    dispose(): void;
}
export interface IReactProp extends IDisposable {
    value: any;
    onChange: IUIPropertyCallback | undefined;
    _: {
        [id: string]: any;
    };
}
export interface IUIPropertyCallback {
    (value: any, where: number, prop: IReactProp, e: any): any | void;
}
export interface IReactPropDefaults {
    _: {
        [id: string]: any;
    };
    value: any;
}
export type IHookValue = number | string | Size | Point | Unit | Rect;
export interface IPropHook {
    value: any;
    modified: boolean;
}
export interface IReactPropHook extends IPropHook {
    name: string;
    prop: ReactProp;
    _: {
        [id: string]: any;
    };
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
    _: {
        [id: string]: IReactPropHook;
    };
    modified: boolean;
}
export interface IComponent {
    type: string;
    name: string;
    props: {
        [x: string]: ComponentPropertyType;
    };
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
export interface IComponentMetadata {
    class: string;
    countStart: number;
    nameTmpl: string;
    labelId: IPoint;
    /**
     * "width, height"
     */
    size: string;
    nodes: IMetadataNodes;
    logic: IMetadataLogic;
    label: IComponentTemplateLabel;
}
export interface IFlowchartMetadata extends IComponentMetadata {
    inputs: number;
    outputs: number;
    /**
     * "width, height"
     */
    minSize: string;
    /**
     * "width, height"
     */
    lockedSize: string;
    fontSize: number;
    text: string;
    /**
     * "x, y"
     */
    position: string;
}
export interface IMetadataNodes {
    createLabels: boolean;
    list: INodeInfo[];
    /**
     * label displacement, default is undefined
     */
    disp?: IPoint;
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
    comp: IComponent;
}
export interface IBaseComponent {
    count: number;
    comp: IComponent;
}
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
export interface IConditionalLabel extends ILabelDefaults {
    node: number;
}
export interface IHighlighNodeDefaults extends IItemBaseDefaults {
    radius: number;
    mainNode: SVGCircleElement;
    selectedId: string;
    selectedNode: number;
}
export interface IItemBoardPropEvent {
    id: string;
    code: number;
    $?: {
        [id: string]: any;
    };
}
/**
 * don't use "nodes" as it's
 */
export interface IItemBoardDefaults extends IItemBaseDefaults {
    props: {
        [x: string]: ComponentPropertyType;
    };
    selected: boolean;
    onProp: (args: IItemBoardPropEvent) => void;
    dir: boolean;
    /**
     * has the highlight node name for [svg-type="hlNode"] and [hlNode="n"]
     */
    hlNode: string;
    /**
     * has the highlight node circle radius
     */
    hlRadius: number;
    /**
     * it's undefined except for Flowcharts, because they reSize
     */
    nodes: INodeInfo[];
}
export interface IWireDefaults extends IItemBoardDefaults {
    points: Point[];
    poly: SVGPolylineElement;
    lines: SVGLineElement[];
    edit: boolean;
    /**
     * polyline arrow for directional wire
     */
    arrow: SVGPolylineElement;
    /**
     * arrow head length for directional wire
     */
    headLength: number;
    /**
     * arrow head line angle for directional wire
     */
    headAngle: number;
}
export interface IItemSolidDefaults extends IItemBoardDefaults {
    /**
     * rotation in 45° (+/-) increments until 360° goes back to 0°
     */
    rot: number;
}
export interface IECDefaults extends IItemSolidDefaults {
    size: Size;
    boardLabel: Label;
}
export interface IFlowChartDefaults extends IItemBoardDefaults {
    size: Size;
    minSize: Size;
    ins: number;
    outs: number;
    fontSize: number;
    text: string;
    svgText: SVGTextElement;
    onResize: (size: Size) => void;
    /**
     * client rect text padding
     */
    padding: number;
}
export interface IFlowProcessDefaults extends IFlowChartDefaults {
    rect: SVGRectElement;
}
export interface IFlowCondDefaults extends IFlowChartDefaults {
    path: SVGPathElement;
    true: ConditionalLabel;
    false: ConditionalLabel;
}
export interface IFlowTermDefaults extends IFlowCondDefaults {
    curve: number;
}
export interface IFlowInOutDefaults extends IFlowCondDefaults {
    shift: number;
}
export interface IBoardCircleDefaults extends IItemDefaults {
    radius: number;
    node: number;
    label: string;
    g: SVGCircleElement;
}
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
/**
 * unbond origin/start data
 */
export interface IUnbondStart {
    /**
    * Direction of the origin/start object
    */
    dir: BondDir;
    /**
     * origin/start unbond id
     */
    id: string;
    /**
     * origin/start unbond node
     */
    node: number;
}
/**
 * unbond data with origin/start and dest info data
 */
export interface IUnbondData extends IUnbondStart {
    toId: string;
    toNode: number;
}
/**
 * unbond data for a full unbond node
 */
export interface IUnbondNodeData extends IUnbondStart {
    /**
     * list unbonded links with id, node
     */
    bonds: {
        id: string;
        node: number;
    }[];
}
