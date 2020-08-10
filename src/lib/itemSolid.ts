import { IItemSolidOptions, IItemSolidProperties, IPoint, IItemNode } from "./interfaces";
import { attr, obj, aCld } from "./dab";
import { each, tag } from "./utils";
import Rect from "./rect";
import Size from "./size";
import Point from "./point";
import Bond from "./bonds";
import ItemBoard from "./itemsBoard";
import Container from "./container";

//ItemBoard->ItemSolid->EC
export default abstract class ItemSolid extends ItemBoard {

	protected __s: IItemSolidProperties;

	get last(): number { return this.base.meta.nodes.list.length - 1 }

	get count(): number {
		return this.base.meta.nodes.list.length
	}

	constructor(container: Container<ItemBoard>, options: IItemSolidOptions) {
		super(container, options);
		this.g.innerHTML = this.base.data;

		//I've to set new properties always, because super just copy defaults()
		//later override method defaults()
		this.__s.rotation = Point.validateRotation(options.rotation);
		let
			createText = (attr: any, text: string) => {
				let
					svgText = tag("text", "", attr);
				return svgText.innerHTML = text, svgText
			}
		//for labels in N555, 7408, Atmega168
		if (this.base.meta.label) {
			aCld(this.g, createText({
				x: this.base.meta.label.x,
				y: this.base.meta.label.y,
				"class": this.base.meta.label.class
			}, this.base.meta.label.text))
		}
		
	}

	get rotation(): number { return this.__s.rotation }

	public rotate(value: number): ItemSolid {
		if (this.__s.rotation != (value = Point.validateRotation(value))) {
			//set new value
			this.__s.rotation = value;

			//trigger property changed if applicable
			this.onProp && this.onProp({
				id: `#${this.id}`,
				value: this.rotation,
				prop: "rotate",
				where: 1				//signals it was a change inside the object
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
				points = [[0, 0], [size.width, 0], [0, size.height], [size.width, size.height]]
					.map(p => new Point(p[0], p[1]).rotateBy(origin.x, origin.y, angle)),
				x = Math.min.apply(Math, points.map(a => a.x)),
				y = Math.min.apply(Math, points.map(a => a.y)),
				w = Math.max.apply(Math, points.map(a => a.x)),
				h = Math.max.apply(Math, points.map(a => a.y));
			return new Rect(Math.round(p.x + x), Math.round(p.y + y), Math.round(w - x), Math.round(h - y))
		}
		return new Rect(p.x, p.y, size.width, size.height)
	}

	public valid(node: number): boolean {
		return !!this.getNode(node)
	}

	public hghlightable(name: number): boolean {
		return this.valid(name)	//for now all valid nodes are highlightables
	}

	public findNode(p: Point): number {
		let
			dx = p.x - this.x,
			dy = p.y - this.y,
			rotation = -this.rotation,
			origin = this.origin;
		for (let i = 0, list = this.base.meta.nodes.list, meta = list[i], len = list.length;
			i < len; meta = list[++i]) {
			let
				nodePoint = this.rotation
					? Point.prototype.rotateBy.call(meta, origin.x, origin.y, rotation)
					: meta;
			//radius 5 =>  5^2 = 25
			if ((Math.pow(dx - nodePoint.x, 2) + Math.pow(dy - nodePoint.y, 2)) <= 81)
				return i;
		}
		return -1;
	}

	public overNode(p: IPoint, ln: number): number {
		for (let i = 0, len = this.count; i < len; i++) {
			let
				pin = this.getNode(i);
			if (this.rotation) {
				pin.x = Math.round(pin.rot.x);
				pin.y = Math.round(pin.rot.y);
			}
			//radius 5 =>  5^2 = 25
			if ((Math.pow((p.x - this.x) - pin.x, 2) + Math.pow((p.y - this.y) - pin.y, 2)) <= 81)
				return i;
		}
		return -1;
	}

	public nodeRefresh(node: number): ItemSolid {
		let
			bond = this.nodeBonds(node),
			pos = this.getNode(node);
		pos && bond && bond.to.forEach((d) => {
			let
				ic = this.container.get(d.id),
				p = Point.plus(this.p, this.rotation ? pos.rot : pos);
			ic && ic.setNode(d.ndx, p)	//no transform
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
		each(this.bonds, (b: Bond, key: any) => {
			this.nodeRefresh(key);
		});
		return this
	}

	//this returns (x, y) relative to the EC location
	public getNode(pinNode: number): IItemNode {
		let
			pin: IItemNode = <IItemNode>this.base.meta.nodes.list[pinNode],
			rotate = (obj: Point, rotation: number, center: Point): Point => {
				if (!rotation)
					return obj;
				let
					rot = obj.rotateBy(center.x, center.y, -rotation);
				return new Point(rot.x, rot.y)
			};
		if (!pin)
			return <any>null;
		pin.rot = rotate(new Point(pin.x, pin.y), this.rotation, this.origin);
		//
		return obj(pin);
	}

	public getNodeRealXY(node: number): Point {
		let
			pos = this.getNode(node);
		return pos ? Point.plus(this.p, this.rotation ? pos.rot : pos) : <any>null;
	}
}