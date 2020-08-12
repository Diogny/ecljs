import { IType, IBondNode, Type } from './interfaces';
import { obj } from './dab';
import ItemBoard from './itemsBoard';

export default class Bond implements IType {

	public from: IBondNode;
	public to: IBondNode[];

	get type(): Type { return Type.BOND }

	get count(): number { return this.to.length }

	// 0>id-0(1)&id-1(12)
	get link(): string { return `${this.from.ndx}>` + this.to.map(b => `${b.id}(${b.ndx})`).join('&') }

	/**
	 * @description implements a component bond, it must be created by default as a One-to-One bond
	 * @param {object} from from
	 * @param {object} to to
	 * @param {number} toNode node
	 * @param {any} fromPin pin
	 */
	constructor(from: ItemBoard, fromPin: number, to: ItemBoard, toNode: number, public origin: boolean) {
		if (!from || !to)
			throw 'empty bond';
		this.from = this.create(from, fromPin);
		this.to = [];
		this.add(to, toNode);
	}

	public has(id: string): boolean { return this.to.some((b) => id == b.id) }

	public get(id: string): IBondNode | undefined {
		return this.to.find((b) => id == b.id)
	}

	public add(t: ItemBoard, ndx: number): boolean {
		if (t && !this.has(t.id)) {
			let
				b: IBondNode = this.create(t, ndx);
			this.to.push(b);
			return true;
		}
		return false;
	}

	private create(ec: ItemBoard, ndx: number): IBondNode {
		return obj({
			id: ec.id,
			type: ec.type,
			ndx: ndx
		})
	}

	/**
	 * @description removes a bond connection from this component item
	 * @param {String} id id name of the destination bond
	 * @returns {IBondNode} removed bond item or null if none
	 */
	public remove(id: string): IBondNode | null {
		let
			ndx = this.to.findIndex((b) => b.id == id),
			b: IBondNode | null = (ndx == -1) ? null : this.to[ndx];
		(b != null) && this.to.splice(ndx, 1);
		return b;
	}

	public toString = (): string => {
		let
			fn = (o: IBondNode) => `#${o.id} [${o.ndx}]`,
			toStr = this.to.map((b) => fn(b)).join(', ');
		return `from ${fn(this.from)} to ${toStr}`
	}

	public static display = (arr: Bond[] | undefined): string[] => {
		return (arr == undefined) ? [] : arr?.filter(b => b != undefined).map((o) => o.toString())
	}

}