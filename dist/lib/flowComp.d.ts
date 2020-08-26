import { Type, IPoint, IFlowChartDefaults } from "./interfaces";
import Size from "./size";
import ItemSolid from "./itemSolid";
import Flowchart from "./flowchart";
import Point from "./point";
import { Rect } from "src";
/**
 * @description flowchart base component class
 */
export default abstract class FlowComp extends ItemSolid {
    protected $: IFlowChartDefaults;
    get type(): Type;
    get minSize(): Size;
    get size(): Size;
    /**
     * body frame, has the real size of component
     */
    abstract get body(): SVGElement;
    /**
     * client rect where text should be safely contained
     */
    abstract get clientRect(): Rect;
    /**
     * @description resize the flowchart component
     * @param value new size
     * @returns true if it was resized, false otherwise
     */
    setSize(value: Size): boolean;
    /**
     * @description every descendant must implement it's own custom node readjustment
     * @param size new size
     */
    abstract onResize(size: Size): void;
    /**
     * @description maximum inbounds
     */
    get inputs(): number;
    /**
     * @description current inbounds
     */
    get ins(): number;
    /**
     * @description maximum outbounds
     */
    get outputs(): number;
    /**
     * @description current outbounds
     */
    get outs(): number;
    /**
     * SVG text
     */
    get svgText(): SVGTextElement;
    get text(): string;
    set text(value: string);
    get fontSize(): number;
    set fontSize(value: number);
    get pos(): Point;
    set pos(value: Point);
    constructor(flowchart: Flowchart, options: {
        [x: string]: any;
    });
    setNode(node: number, p: IPoint): FlowComp;
    defaults(): IFlowChartDefaults;
}
