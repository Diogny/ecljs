import { IType, ISize, IItemDefaults, Type, Base } from "./interfaces";
import Point from "./point";

export default abstract class Item extends Base implements IType {

	//thi's until we can get real private variables
	protected __s: IItemDefaults;

	abstract get type(): Type;

	get name(): string { return this.__s.name }
	get id(): string { return this.__s.id }
	get x(): number { return this.__s.x }
	get y(): number { return this.__s.y }
	get p(): Point { return new Point(this.x, this.y) }
	get class(): string { return this.__s.class }
	get visible(): boolean { return this.__s.visible; }

	abstract get ClientRect(): ISize;
	abstract get box(): any;

	constructor(options: { [x: string]: any; }) {
		//merge defaults and deep copy
		//all default properties must be refrenced from this or this.__s
		// options is for custom options only
		let
			optionsClass = options.class;
		delete options.class;
		super(options);
		optionsClass && (this.__s.class = this.__s.class ? ' ' : '' + optionsClass); // unique((this.class + " " + optionsClass).split(' ')).join(' '));
		this.__s.x = this.__s.x || 0;
		this.__s.y = this.__s.y || 0;
	}

	public setVisible(value: boolean): Item {
		this.__s.visible = !!value;
		return this;
	}

	public move(x: number, y: number): Item {
		this.__s.x = x | 0;
		this.__s.y = y | 0;
		return this;
	}

	public movePoint(p: Point): Item {
		return this.move(p.x, p.y)
	}

	public translate(dx: number, dy: number): Item {
		return this.move(this.x + (dx | 0), this.y + (dy | 0));
	}

	public defaults(): IItemDefaults {
		return <IItemDefaults>{
			id: "",
			name: "",
			x: 0,
			y: 0,
			class: "",
			visible: true,		//defaults is visible
			label: "",
			base: <any>void 0	//this comes from createItem by default
		}
	}
}