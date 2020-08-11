import { IPoint, IItemBoardProperties, IItemBaseOptions, INodeInfo } from './interfaces';
import { tCl, attr, extend, isFn } from './dab';
import Point from './point';
import Bond from './bonds';
import ItemBase from './itemsBase';
import Container from './container';

//ItemBoard->Wire
export default abstract class ItemBoard extends ItemBase {

	protected __s: IItemBoardProperties;

	get onProp(): Function { return this.__s.onProp }
	get selected(): boolean { return this.__s.selected }
	get bonds(): Bond[] | undefined { return this.container.itemBonds(this) }
	get directional(): boolean { return this.__s.directional }
	get label(): string { return this.__s.label }

	abstract get count(): number;
	abstract valid(node: number): boolean;
	abstract get last(): number;
	abstract refresh(): ItemBoard;
	abstract nodeRefresh(node: number): ItemBoard;
	abstract getNode(node: number, onlyPoint?: boolean): INodeInfo | undefined;
	abstract setNode(node: number, p: IPoint): ItemBoard;
	abstract overNode(p: IPoint, ln?: number): number;
	//finds a matching point, faster
	abstract findNode(p: Point): number;

	//this returns true for an EC, and any Wire node and that it is not a start|end bonded node
	abstract hghlightable(node: number): boolean;

	constructor(public container: Container<ItemBoard>, options: IItemBaseOptions) {
		super(options);
		if (!container)
			throw `component without container`;
		attr(this.g, {
			id: this.id,
			"svg-comp": this.base.type,
		})
		//this still doesn't work to get all overridable properties ¿?
		//properties still cannot access super value
		//(<any>this.__s).__selected = dab.propDescriptor(this, "selected");
	}

	public select(value: boolean): ItemBoard {
		if (this.selected != value) {
			//set new value
			this.__s.selected = value;
			//add class if selected, otherwise removes it
			tCl(this.g, "selected", this.selected);
			//trigger property changed if applicable
			this.onProp && this.onProp({
				id: `#${this.id}`,
				value: this.selected,
				prop: "selected",
				where: 1				//signals it was a change inside the object
			});
		}
		return this;
	}

	public move(x: number, y: number): ItemBoard {
		super.move(x, y);
		//trigger property changed if applicable
		this.onProp && this.onProp({
			id: `#${this.id}`,
			args: {
				x: this.x,
				y: this.y
			},
			method: 'move',
			where: 1				//signals it was a change inside the object
		})
		return this;
	}

	public setOnProp(value: Function): ItemBoard {
		isFn(value) && (this.__s.onProp = value);
		return this;
	}

	public bond(thisNode: number, ic: ItemBoard, icNode: number): boolean {
		return this.container.bond(this, thisNode, ic, icNode)
	}

	public nodeBonds(node: number): Bond | undefined {
		return this.container.nodeBonds(this, node); // <Bond>(<any>this.bonds)[node]
	}

	public unbond(node: number, id: string): void {
		this.container.unbond(this, node, id)
	}

	public unbondNode(node: number): void {
		this.container.unbondNode(this, node)
	}

	public disconnect() {
		this.container.disconnect(this)
	}

	public defaults(): IItemBoardProperties {
		return extend(super.defaults(), {
			selected: false,
			onProp: void 0,
			directional: false,
		})
	}

}

