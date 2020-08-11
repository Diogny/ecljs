
import { IHighlightable } from "./interfaces";
import { attr } from "./dab";
import { tag } from "./utils";
import Point from "./point";

export default class BoardCircle implements IHighlightable {

	protected __s: IHighlightable;

	get visible(): boolean { return this.__s.visible }
	get p(): Point { return this.__s.p }
	get nodeName(): string { return this.__s.nodeName }
	get nodeValue(): number { return this.__s.nodeValue }
	get radius(): number { return this.__s.radius }
	get g(): SVGCircleElement { return this.__s.g }

	constructor(nodeName: string) {
		//set initial default values
		this.__s = <IHighlightable>{
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
		this.__s.g = <SVGCircleElement>tag("circle", "", tagAttrs);
	}

	public domRadius(): number {
		return parseInt(attr(this.g, "r"))
	}

	move(x: number, y: number): BoardCircle {
		this.__s.p = new Point(x, y);
		return this;
	}

	public setRadius(value: number): BoardCircle {
		this.__s.radius = value <= 0 ? 5 : value;
		return this.refresh();
	}

	public hide(): BoardCircle {
		this.__s.visible = false;
		this.__s.p = Point.origin;
		this.__s.nodeValue = -1;
		return this.refresh();
	}

	public show(nodeValue: number): BoardCircle {
		this.__s.visible = true;
		// this.p  moved first
		this.__s.nodeValue = nodeValue;
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