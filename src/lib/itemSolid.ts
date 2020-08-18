import { IItemSolidDefaults, IPoint, INodeInfo } from "./interfaces";
import { attr, aChld, extend } from "./dab";
import { each, tag } from "./utils";
import Rect from "./rect";
import Size from "./size";
import Point from "./point";
import Bond from "./bonds";
import ItemBoard from "./itemsBoard";
import Container from "./container";

//ItemBoard->ItemSolid->EC
export default abstract class ItemSolid extends ItemBoard {

	protected $: IItemSolidDefaults;

	get last(): number { return this.base.meta.nodes.list.length - 1 }

	get count(): number {
		return this.base.meta.nodes.list.length
	}

	constructor(container: Container<ItemBoard>, options: { [x: string]: any; }) {
		options.rotation = Point.validateRotation(options.rotation);
		super(container, options);
		this.g.innerHTML = this.base.data;
		let
			createText = (attr: any, text: string) => {
				let
					svgText = tag("text", "", attr);
				return svgText.innerHTML = text, svgText
			}
		//for labels in N555, 7408, Atmega168
		if (this.base.meta.label) {
			aChld(this.g, createText({
				x: this.base.meta.label.x,
				y: this.base.meta.label.y,
				"class": this.base.meta.label.class
			}, this.base.meta.label.text))
		}

	}

	get rotation(): number { return this.$.rotation }

	public rotate(value: number): ItemSolid {
		if (this.$.rotation != (value = Point.validateRotation(value))) {
			this.$.rotation = value;
			this.onProp && this.onProp({
				id: `#${this.id}`,
				code: 4					// "rotate" code: 4
			});
		}
		return <ItemSolid>this.refresh();
	}

	public move(x: number, y: number): ItemSolid {
		super.move(x, y);
		return <ItemSolid>this.refresh();
	}

	public rect(): Rect {
		let
			size = Size.create(this.box),
			p = this.p;
		if (this.rotation) {
			//rotate (0,0) (width,0) (width,height) (0,height) and get the boundaries respectivelly to the location (x,y)
			let
				origin = this.origin,
				angle = -this.rotation,
				points = [[p.x, p.y], [p.x + size.width, p.y], [p.x, p.y + size.height], [p.x + size.width, p.y + size.height]]
					.map(p => Point.rotateBy(p[0], p[1], origin.x, origin.y, angle)),
				x = Math.min.apply(Math, points.map(a => a.x)),
				y = Math.min.apply(Math, points.map(a => a.y)),
				w = Math.max.apply(Math, points.map(a => a.x)),
				h = Math.max.apply(Math, points.map(a => a.y));
			return new Rect(Math.round(x), Math.round(y), Math.round(w - x), Math.round(h - y))
		}
		return new Rect(p.x, p.y, size.width, size.height)
	}

	public valid(node: number): boolean { return node >= 0 && node < this.count; }

	public hghlightable(node: number): boolean { return this.valid(node) }

	public static nodeArea = 81;

	public overNode(p: IPoint, ln?: number): number {
		for (let i = 0, len = this.count; i < len; i++) {
			let
				node = <INodeInfo>this.getNode(i);
			//radius 5 =>  5^2 = 25
			if ((Math.pow((p.x) - node.x, 2) + Math.pow((p.y) - node.y, 2)) <= ItemSolid.nodeArea)
				return i;
		}
		return -1;
	}

	public nodeRefresh(node: number): ItemSolid {
		let
			bond = this.nodeBonds(node),
			p = this.getNode(node);
		p && bond && bond.to.forEach((d) => {
			let
				ic = this.container.get(d.id);
			ic && ic.setNode(d.ndx, <IPoint>p)
		});
		return this;
	}

	public refresh(): ItemSolid {
		let
			attrs: any = {
				transform: `translate(${this.x} ${this.y})`
			},
			center = this.origin;
		if (this.rotation) {
			attrs.transform += ` rotate(${this.rotation} ${center.x} ${center.y})`
		}
		attr(this.g, attrs);
		//check below
		each(this.bonds, (b: Bond, key: any) => {
			this.nodeRefresh(key);
		});
		return this
	}

	//this returns (x, y) relative to the EC location
	/**
	 * 
	 * @param pinNode pin/node number
	 * @param onlyPoint true to get internal rotated point only without transformations
	 */
	public getNode(node: number, nodeOnly?: boolean): INodeInfo | undefined {
		let
			pin = <INodeInfo>pinInfo(this, node);
		if (!pin)
			return;
		if (!nodeOnly) {
			if (this.rotation) {
				let
					center = this.origin,
					rot = Point.rotateBy(pin.x, pin.y, center.x, center.y, -this.rotation);
				pin.x = rot.x;
				pin.y = rot.y
			}
			pin.x += this.x;
			pin.y += this.y;
		}
		return pin
	}

	public defaults(): IItemSolidDefaults {
		return <IItemSolidDefaults>extend(super.defaults(), {
			rotation: 0,
		})
	}

}
function pinInfo(that: ItemSolid, node: number): INodeInfo | undefined {
	let
		pin = <INodeInfo>that.base.meta.nodes.list[node];
	return pin && {
		x: pin.x,
		y: pin.y,
		label: pin.label
	}
}