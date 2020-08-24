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

	abstract get count(): number;
	abstract valid(node: number): boolean;
	abstract get last(): number;
	abstract refresh(): ItemBoard;
	abstract nodeRefresh(node: number): ItemBoard;
	abstract node(node: number, nodeOnly?: boolean): INodeInfo | undefined;
	abstract setNode(node: number, p: IPoint): ItemBoard;
	abstract over(p: IPoint, ln?: number): number;

	constructor(public container: Container<ItemBoard>, options: { [x: string]: any; }) {
		super(options);
		if (!container)
			throw `missing container`;
		//create getter/setters for every property, so type=="size" or "point" don't need to parse always
		//and later save it along the .xml file for custom values

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

	//this returns true for an EC, and any Wire node and that it is not a start|end bonded node
	abstract highlightable(node: number): boolean;

	/**
	 * @description returns true if there's at least one node highlighted
	 */
	get isHighlighted(): boolean { return this.$.highlights["length"] != 0 }

	/**
	 * @description returns highlighted status of a node, or sets it's status
	 * @param node 0-based node
	 * @param value undefined: returns Highlighter; true: highlights; false: removes highlight
	 * @returns Highlighter for get if exists & set to true; otherwise undefined
	 */
	public highlighted(node: number, value?: boolean): CompNode | undefined {
		//get part
		if (value === undefined) {
			return this.$.highlights[node]
		}
		//set part
		let
			hl = this.$.highlights[node];
		if (value === false) {
			//remove if exists, otherwise do nothing, it doesn't exists
			if (hl) {
				let
					svg = this.g.removeChild(hl.g);
				delete this.$.highlights[node];
				this.$.highlights["length"]--;
				return
			}
		}
		else {
			if (!this.highlightable(node))
				return;
			//value == true, and it doesn't exists, create and return
			//some bug, it's not deleted
			let
				pin = <INodeInfo>this.node(node, true),
				exists = hl != undefined;
			hl = new CompNode({
				node: node,
				x: pin.x,
				y: pin.y,
				label: pin.label
			});
			this.g.appendChild(hl.g);
			this.$.highlights[node] = hl;
			!exists && this.$.highlights["length"]++;
		}
	}

	/**
	 * @description show/hide all node highlighted
	 * @param value true shows all nodes highlighted, false removes all highlights
	 */
	public highlight(value: boolean): void {
		//setting to false with no highlights shortcut
		//if (!value && !this.isHighlighted)
		//	return;
		for (let node = 0, count = this.count; node < count; node++)
			this.highlighted(node, value);
	}

	/**
	 * @description removes all highlights except for this node
	 * @param node 0-base node
	 */
	public highlightThis(node: number): void {
		for (let n = 0, count = this.count; n < count; n++)
			(n != node)
				&& this.highlighted(n, false);
	}

	/**
	 * @description refreshes the node highlight position, useful for wire node draggings
	 * @param node 0-base node
	 */
	public refreshHighlight(node: number): boolean {
		let
			hl = this.highlighted(node);
		if (hl) {
			let
				pin = <INodeInfo>this.node(node, true);
			//only changes x,y
			hl.move(pin.x, pin.y);
			return true
		}
		return false
	}

	/**
	 * @description bonds two components two-way
	 * @param node 0-based node
	 * @param ic component to bond to
	 * @param icNode component node
	 */
	public bond(node: number, ic: ItemBoard, icNode: number): boolean {
		return this.container.bond(this, node, ic, icNode)
	}

	public nodeBonds(node: number): Bond | undefined {
		return this.container.nodeBonds(this, node); // <Bond>(<any>this.bonds)[node]
	}

	/**
	 * @description unbonds a node from a component
	 * @param node 0-base node to unbond
	 * @param id component to unbond from
	 */
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
		this.highlight(false);
		super.remove()
	}

	public disconnect() {
		this.container.disconnect(this)
	}

	public prop(name: string): ComponentPropertyType {
		return this.$.props[name]
	}

	/**
	 * @description returns all custom properties of this component
	 */
	get props(): { [x: string]: ComponentPropertyType } { return this.$.props }

	public defaults(): IItemBoardDefaults {
		return <IItemBoardDefaults>extend(super.defaults(), {
			selected: false,
			onProp: void 0,
			dir: false,
			highlights: { length: 0 }
		})
	}

}
