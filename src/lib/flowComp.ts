import { Type, IPoint, IFlowChartDefaults, IFlowchartMetadata } from "./interfaces";
import { extend, aChld, css } from "./dab";
import Size from "./size";
import ItemSolid from "./itemSolid";
import Flowchart from "./flowchart";
import Point from "./point";
import { createText } from "./utils";

/**
 * @description flowchart base component class
 */
export default abstract class FlowComp extends ItemSolid {

	protected $: IFlowChartDefaults;

	get type(): Type { return Type.FLOWCHART }

	get minSize(): Size { return this.$.minSize }

	get size(): Size { return this.$.size }

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
		this.$.size = <Size>Size.parse((<IFlowchartMetadata>this.base.meta).size);
		this.$.minSize = <Size>Size.parse((<IFlowchartMetadata>this.base.meta).minSize);
		this.$.fontSize = (<IFlowchartMetadata>this.base.meta).fontSize;
		this.$.text = (<IFlowchartMetadata>this.base.meta).text;
		this.$.pos = <Point>Point.parse((<IFlowchartMetadata>this.base.meta).position);
		//create text if defined
		aChld(this.g, this.$.svgText = createText({
			x: this.$.pos.x,
			y: this.$.pos.y,
			//"class": this.base.meta.label.class
		}, this.text));
		css(this.$.svgText, {
			"font-size": this.fontSize + "px",
		})
	}

	public setNode(node: number, p: IPoint): FlowComp {
		//nobody should call this
		return this;
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
			outs: 0
		})
	}
}