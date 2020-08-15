import { IPoint, IItemBoardDefaults, INodeInfo, ComponentPropertyType, IItemBoardPropEvent } from './interfaces';
import { tCl, attr, extend, isFn, obj } from './dab';
import Bond from './bonds';
import ItemBase from './itemsBase';
import Container from './container';

//ItemBoard->Wire
export default abstract class ItemBoard extends ItemBase {

	protected $: IItemBoardDefaults;

	get onProp(): (args: IItemBoardPropEvent) => void { return this.$.onProp }
	get selected(): boolean { return this.$.selected }
	get bonds(): Bond[] | undefined { return this.container.itemBonds(this) }
	get dir(): boolean { return this.$.dir }

	abstract get count(): number;
	abstract valid(node: number): boolean;
	abstract get last(): number;
	abstract refresh(): ItemBoard;
	abstract nodeRefresh(node: number): ItemBoard;
	abstract getNode(node: number, onlyPoint?: boolean): INodeInfo | undefined;
	abstract setNode(node: number, p: IPoint): ItemBoard;
	abstract overNode(p: IPoint, ln?: number): number;

	//this returns true for an EC, and any Wire node and that it is not a start|end bonded node
	abstract hghlightable(node: number): boolean;

	constructor(public container: Container<ItemBoard>, options: { [x: string]: any; }) {
		super(options);
		if (!container)
			throw `missing container`;
		this.$.props = obj(this.base.props);
		attr(this.g, {
			id: this.id,
			"svg-comp": this.base.type,
		})
		//this still doesn't work to get all overridable properties ¿?
		//properties still cannot access super value
		//(<any>this.$).$elected = dab.propDescriptor(this, "selected");
	}

	public select(value: boolean): ItemBoard {
		if (this.selected != value) {
			//set new value
			this.$.selected = value;
			//add class if selected, otherwise removes it
			tCl(this.g, "selected", this.selected);
			//trigger property changed if applicable
			this.onProp && this.onProp({
				id: `#${this.id}`,
				code: 3					// "selected" code: 3
			});
		}
		return this;
	}

	public move(x: number, y: number): ItemBoard {
		super.move(x, y);
		//trigger property changed if applicable
		this.onProp && this.onProp({
			id: `#${this.id}`,
			code: 2					// "move" code: 2
		})
		return this;
	}

	public setOnProp(value: (args: IItemBoardPropEvent) => void): ItemBoard {
		isFn(value) && (this.$.onProp = value);
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

	/**
	 * @description unbonds a node
	 * @param node 0-base node
	 * @returns undefined if invalid node, otherwise list of disconnected wire ids
	 */
	public unbondNode(node: number): string[] | undefined {
		return this.container.unbondNode(this, node)
	}

	public disconnect() {
		this.container.disconnect(this)
	}

	public prop(propName: string): ComponentPropertyType {
		return this.$.props[propName]
	}

	public defaults(): IItemBoardDefaults {
		return <IItemBoardDefaults>extend(super.defaults(), {
			selected: false,
			onProp: void 0,
			dir: false,
		})
	}

}

