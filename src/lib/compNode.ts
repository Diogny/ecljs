
import { IBoardCircleDefaults } from "./interfaces";
import { attr, extend } from "./dab";
import { tag } from "./utils";
import Point from "./point";
import Item from "./item";

export default class CompNode extends Item {

	protected $: IBoardCircleDefaults;

	get p(): Point { return new Point(this.x, this.y) }
	//get name() is nodeName 
	get node(): number { return this.$.node }
	get radius(): number { return this.$.radius }
	get g(): SVGCircleElement { return this.$.g }

	constructor(options: { [id: string]: any }) {
		super(options);
		//create SVG
		this.$.g = <SVGCircleElement>tag("circle", "", {
			"svg-type": this.name,
			class: this.class
		});
	}

	move(x: number, y: number): CompNode {
		super.move(x, y);
		return this.refresh()
	}

	public setVisible(value: boolean): CompNode {
		//this item is always visible as long as it's in the DOM, hide means to remove it from DOM and destroy object
		return this;
	}

	public setRadius(value: number): CompNode {
		this.$.radius = value <= 0 ? 5 : value;
		return this.refresh()
	}

	public refresh(): CompNode {
		let
			obj: { [id: string]: any } = {
				cx: this.x,
				cy: this.y,
				r: this.radius
			};
		obj[this.name] = this.node;
		return (attr(this.g, obj), this)
	}

	public defaults(): IBoardCircleDefaults {
		return <IBoardCircleDefaults>extend(super.defaults(), {
			name: "node",
			node: -1,
			label: "",
			g: void 0,
			radius: 5,
		})
	}

}