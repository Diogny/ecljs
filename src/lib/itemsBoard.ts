import { IPoint, IItemBoardDefaults, INodeInfo, ComponentPropertyType, IItemBoardPropEvent } from './interfaces';
import { tCl, attr, extend, isFn, obj } from './dab';
import Bond from './bonds';
import ItemBase from './itemsBase';
import Container from './container';
import CompNode from './compNode';

//ItemBoard->Wire
export default abstract class ItemBoard extends ItemBase {

	protected $: IItemBoardDefaults;

	get onProp(): (args: IItemBoardPropEvent) => void { return this.$.onProp }
	get selected(): boolean { return this.$.selected }
	get bonds(): Bond[] | undefined { return this.container.itemBonds(this) }
	get dir(): boolean { return this.$.dir }
	get highlights(): CompNode[] { return this.$.highlights }
	get highlighted(): boolean { return this.$.highlights.length != 0 }

	abstract get count(): number;
	abstract valid(node: number): boolean;
	abstract get last(): number;
	abstract refresh(): ItemBoard;
	abstract nodeRefresh(node: number): ItemBoard;
	abstract getNode(node: number, nodeOnly?: boolean): INodeInfo | undefined;
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

	/**
	 * @description highlights a node, or keeps highlighting more nodes
	 * @param node 0-base node to be highlighted
	 * @param multiple false is default, so it highlights only this node, true is multiple highlighted nodes
	 */
	public highlightNode(node: number, multiple?: boolean): boolean | undefined {
		return highlightNode(this, this.$, node, multiple)
	}

	/**
	 * @description show/hide all node highlighted
	 * @param value true shows all nodes highlighted, false removes all highlights
	 */
	public highlight(value: boolean): void {
		if (value && this.highlights.length == this.count)
			//already set
			return;
		//remove highlights if any
		clear(this, this.$);
		if (value) {
			for (let node = 0; node < this.count; node++)
				highlightNode(this, this.$, node, true, true)
		}
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

	public remove() {
		clear(this, this.$);
		super.remove()
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
			highlights: []
		})
	}

}

function clear(that: ItemBoard, $: IItemBoardDefaults) {
	$.highlights = $.highlights.filter(hl => (that.g.removeChild(hl.g), false));
}

function highlightNode(that: ItemBoard, $: IItemBoardDefaults, node: number, multiple?: boolean, noCheck?: boolean): boolean | undefined {
	let
		pin = that.getNode(node, true);
	if (!pin)
		return;
	if (multiple) {
		//avoid calling this for every node when doing a full internal highlight
		if (!noCheck && $.highlights.some(hl => hl.node == node))
			return false
	}
	else
		clear(that, $);
	let
		hl = new CompNode({
			node: node,
			x: pin.x,
			y: pin.y,
			label: pin.label
		});
	that.g.appendChild(hl.g);
	(!multiple && ($.highlights = [hl], true)) || $.highlights.push(hl);
	return true
}