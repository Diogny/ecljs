import { IType, IItemDefaults, Type, Base } from "./interfaces";
import Point from "./point";

export default abstract class Item extends Base implements IType {

	//thi's until we can get real private variables
	protected $: IItemDefaults;

	abstract get type(): Type;

	get name(): string { return this.$.name }
	get id(): string { return this.$.id }
	get x(): number { return this.$.x }
	get y(): number { return this.$.y }
	get p(): Point { return new Point(this.x, this.y) }
	get class(): string { return this.$.class }
	get visible(): boolean { return this.$.visible; }

	constructor(options: { [x: string]: any; }) {
		//merge defaults and deep copy
		//all default properties must be refrenced from this or this.$
		// options is for custom options only
		let
			optionsClass = options.class;
		delete options.class;
		super(options);
		optionsClass && (this.$.class += ` ${optionsClass}`);
		this.$.x = this.$.x || 0;
		this.$.y = this.$.y || 0;
	}

	public setVisible(value: boolean): Item {
		this.$.visible = !!value;
		return this;
	}

	public move(x: number, y: number): Item {
		this.$.x = x | 0;
		this.$.y = y | 0;
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
		}
	}
}