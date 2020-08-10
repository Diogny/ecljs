import { IType, ISize, IItemBaseOptions, Type, Base } from "./interfaces";
import { unique } from "./dab";
import Point from "./point";

export default abstract class Item extends Base implements IType {

	//thi's until we can get real private variables
	protected __s: IItemBaseOptions;

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

	constructor(options: IItemBaseOptions) {
		//merge defaults and deep copy
		//all default properties must be refrenced from this or this.__s
		// options is for custom options only
		let
			optionsClass = options.class || "";
		delete options.class;
		super(options);
		//this.__s = obj(copy(this.defaults(), options));
		this.__s.class = unique((this.class + " " + optionsClass).split(' ')).join(' ');
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

	public defaults(): IItemBaseOptions {
		return <IItemBaseOptions>{
			id: "",
			name: "",
			x: 0,
			y: 0,
			class: "",
			visible: true,		//defaults is visible
			base: <any>void 0,
			label: ""
		}
	}
}