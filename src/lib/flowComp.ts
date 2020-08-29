import { extend, aChld, css, toBool, clone, attr } from "dabbjs/dist/lib/dab";
import { each } from "dabbjs/dist/lib/utils";
import Point from "dabbjs/dist/lib/point";
import Size from "dabbjs/dist/lib/size";
import Rect from "dabbjs/dist/lib/rect";
//
import { Type, IFlowChartDefaults, IFlowchartMetadata, INodeInfo } from "./interfaces";
import Flowchart from "./flowchart";
import ItemBoard from "./itemsBoard";
import Bond from "./bonds";
import { createText, pinInfo } from "./extra";

/**
 * @description flowchart base component class
 */
export default abstract class FlowComp extends ItemBoard {

	protected $: IFlowChartDefaults;

	get type(): Type { return Type.FLOWCHART }

	get last(): number { return this.$.nodes.length - 1 }

	get count(): number { return this.$.nodes.length }

	get minSize(): Size { return this.$.minSize }

	get size(): Size { return this.$.size }

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
	public setSize(value: Size): boolean {
		if (!value.equal(this.size)) {
			let
				s = new Size(value.width - this.minSize.width, value.height - this.minSize.height);
			if (s.positive) {
				//for flowchart conditional
				if (toBool((<IFlowchartMetadata>this.base.meta).lockedSize)) {
					let
						m = Math.min(value.width, value.height);
					value.width = m;
					value.height = m
				}
				this.$.size = value;
				//internal adjust node points
				this.onResize(value);
				this.refresh();
				//hooked events if any
				this.$.onResize && this.$.onResize(value);
				return true
			}
		}
		return false
	}

	/**
	 * @description every descendant must implement it's own custom node readjustment
	 * @param size new size
	 */
	abstract onResize(size: Size): void;

	/**
	 * @description maximum inbounds
	 */
	get inputs(): number { return (<IFlowchartMetadata>this.base.meta).inputs }

	/**
	 * @description current inbounds
	 */
	get ins(): number { return this.$.ins }

	/**
	 * @description maximum outbounds
	 */
	get outputs(): number { return (<IFlowchartMetadata>this.base.meta).outputs }

	/**
	 * @description current outbounds
	 */
	get outs(): number { return this.$.outs }

	/**
	 * SVG text, changing SVG text x's value, must change all inside tspan x's values too
	 */
	get svgText(): SVGTextElement { return this.$.svgText }

	//will be removed, internal, just to dev easier from outside
	get text(): string { return this.$.text }
	set text(value: string) { this.$.text = value }
	get fontSize(): number { return this.$.fontSize }
	set fontSize(value: number) { this.$.fontSize = value }
	get pos(): Point { return this.$.pos }
	set pos(value: Point) { this.$.pos = value }

	constructor(flowchart: Flowchart, options: { [x: string]: any; }) {
		super(flowchart, options);
		//get size from properties
		//(<string>(<IComponentProperty>this.prop("size")).value) = `${value.width},${value.height}`;
		this.$.nodes = clone(this.base.meta.nodes.list);
		this.$.size = <Size>Size.parse((<IFlowchartMetadata>this.base.meta).size);
		this.$.minSize = <Size>Size.parse((<IFlowchartMetadata>this.base.meta).minSize);
		this.$.fontSize = (<IFlowchartMetadata>this.base.meta).fontSize;
		this.$.text = (<IFlowchartMetadata>this.base.meta).text;
		this.$.pos = <Point>Point.parse((<IFlowchartMetadata>this.base.meta).position);
		//create text
		aChld(this.g, this.$.svgText = createText({
			x: this.$.pos.x,
			y: this.$.pos.y,
			//"class": this.base.meta.label.class
		}, `<tspan x="${this.$.pos.x}" dy="0">${this.text}</tspan>`));
		css(this.$.svgText, {
			"font-size": this.fontSize + "px",
		})
	}

	/**
	 * @description returns the node information
	 * @param node 0-based pin/node number
	 * @param onlyPoint true to get internal point, false get the real board point
	 * 
	 * this returns (x, y) relative to the EC location
	 */
	public node(node: number, nodeOnly?: boolean): INodeInfo | undefined {
		let
			pin = <INodeInfo>pinInfo(this.$.nodes, node);
		if (!nodeOnly) {
			pin.x += this.x;
			pin.y += this.y;
		}
		return pin
	}

	public refresh(): FlowComp {
		let
			attrs: any = {
				transform: `translate(${this.x} ${this.y})`
			};
		attr(this.g, attrs);
		//check below
		each(this.bonds, (b: Bond, key: any) => {
			this.nodeRefresh(key);
		});
		return this
	}

	//highlights from itemSolid must be overridden here to allow inputs/outputs when available
	//	DirType = 0,	show only available outputs
	//			= 1,	show ony available inputs
	//wiring must send signal if it's starting or ending the bond

	public defaults(): IFlowChartDefaults {
		return <IFlowChartDefaults>extend(super.defaults(), {
			class: "fl",
			dir: true,
			onResize: void 0,
			ins: 0,
			outs: 0,
			padding: 2
		})
	}
}