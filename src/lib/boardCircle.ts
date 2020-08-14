
import { IHighlightable } from "./interfaces";
import { attr } from "./dab";
import { tag } from "./utils";
import Point from "./point";

export default class BoardCircle implements IHighlightable {

	protected $: IHighlightable;

	get visible(): boolean { return this.$.visible }
	get p(): Point { return this.$.p }
	get nodeName(): string { return this.$.nodeName }
	get nodeValue(): number { return this.$.nodeValue }
	get radius(): number { return this.$.radius }
	get g(): SVGCircleElement { return this.$.g }

	constructor(nodeName: string) {
		//set initial default values
		this.$ = <IHighlightable>{
			nodeName: nodeName || "node",
			nodeValue: -1,
			visible: false,
			radius: 5,
			p: Point.origin
		}
		//create SVG DOM Element
		let
			tagAttrs: any = this.settings();
		//set svg-type and nodeName value for 'node'
		tagAttrs["svg-type"] = this.nodeName;
		tagAttrs[this.nodeName] = this.nodeValue;
		//create SVG
		this.$.g = <SVGCircleElement>tag("circle", "", tagAttrs);
	}

	public domRadius(): number {
		return parseInt(attr(this.g, "r"))
	}

	move(x: number, y: number): BoardCircle {
		this.$.p = new Point(x, y);
		return this;
	}

	public setRadius(value: number): BoardCircle {
		this.$.radius = value <= 0 ? 5 : value;
		return this.refresh();
	}

	public hide(): BoardCircle {
		this.$.visible = false;
		this.$.p = Point.origin;
		this.$.nodeValue = -1;
		return this.refresh();
	}

	public show(nodeValue: number): BoardCircle {
		this.$.visible = true;
		// this.p  moved first
		this.$.nodeValue = nodeValue;
		return this.refresh();
	}

	private settings(): any {
		let
			o: any = {
				cx: this.p.x,
				cy: this.p.y,
				r: this.radius,
				class: this.visible ? "" : "hide"
			};
		(<any>o)[this.nodeName] = this.nodeValue;
		return o;
	}

	public refresh(): BoardCircle {
		return (attr(this.g, this.settings()), this)
	}

}