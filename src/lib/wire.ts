import { Type, IPoint, IWireDefaults, INodeInfo } from './interfaces';
import { aCl, rCl, attr, isArr, extend } from './dab';
import { tag } from './utils';
import Point from './point';
import Rect from './rect';
import ItemBoard from './itemsBoard';
import Container from './container';

export default class Wire extends ItemBoard {

	protected $: IWireDefaults;

	get type(): Type { return Type.WIRE }

	get count(): number { return this.$.points.length }

	get last(): number { return this.$.points.length - 1 }

	get lastLine(): number { return this.editMode ? this.$.lines.length : 0 }

	get isOpen(): boolean { return !this.nodeBonds(0) || !this.nodeBonds(this.last) }

	public rect(): Rect { return Rect.create(this.box) }

	get points(): Point[] { return Array.from(this.$.points) }

	get editMode(): boolean { return this.$.edit }

	set editMode(value: boolean) {
		if (this.editMode == value)
			return;
		if (this.editMode) {
			//	will change to false
			//		.destroy lines
			this.$.lines = this.$.lines.filter(ln => {
				this.g.removeChild(ln);
				return false
			});
			//		.recreate polyline
			this.refresh();
			//		.show polyline
			rCl(this.$.polyline, "hide")
		} else {
			//	will change to true
			//		.hide polyline
			aCl(this.$.polyline, "hide");
			//		.create lines
			for (let i = 0, a = this.$.points[0], cnt = this.last; i < cnt; i++) {
				let
					b = this.$.points[i + 1],
					ln = tag("line", "", {
						"svg-type": "line",
						line: (i + 1),
						x1: a.x,
						y1: a.y,
						x2: b.x,
						y2: b.y
					});
				this.$.lines.push(ln);
				this.g.insertBefore(ln, this.$.polyline);
				a = b;
			}
		}
		this.$.edit = value
	}

	constructor(container: Container<ItemBoard>, options: { [x: string]: any; }) {
		super(container, options);
		this.$.dir = container.dir;
		this.$.polyline = tag("polyline", "", {
			"svg-type": "line",
			line: "0",
			points: "",
		});
		this.g.append(this.$.polyline);
		this.setPoints(options.points);
		this.onProp && this.onProp({
			id: `#${this.id}`,
			code: 1					// "create" code = 1
		})
	}

	public refresh(): Wire {
		attr(this.$.polyline, {
			points: this.$.points.map(p => `${p.x}, ${p.y}`).join(' ')
		});
		return this;
	}

	public nodeRefresh(node: number): Wire {
		if (this.editMode) {
			let
				ln: SVGElement,
				p = this.$.points[node];
			(ln = this.$.lines[node - 1]) && attr(ln, { x2: p.x, y2: p.y });
			(ln = this.$.lines[node]) && attr(ln, { x1: p.x, y1: p.y });
		} else {
			this.refresh();
		}
		if (!(node == 0 || node == this.last)) {
			let
				bond = this.nodeBonds(node),
				p = this.$.points[node];
			bond && bond.to.forEach(b => {
				this.container.get(b.id)?.setNode(b.ndx, p)
			})
		}
		return this;
	}

	public translate(dx: number, dy: number): Wire {
		super.translate(dx, dy);
		//don't translate bonded end points because it should have been|will be moved by bonded EC or Wire
		let
			savedEditMode = this.editMode;
		this.editMode = false;
		for (let i = 0, p = this.$.points[i], end = this.last; i <= end; p = this.$.points[++i]) {
			if ((i > 0 && i < end) || ((i == 0 || i == end) && !this.nodeBonds(i))) {
				this.setNode(i, Point.translateBy(p, dx, dy));
			}
		}
		this.editMode = savedEditMode;
		return this;
	}

	/**
	 * @description returns true if a point is valid
	 * @comment later see how to change this to validNode, conflict in !ic.valid(node)
	 * 		because we don't know if it's a IC or a wire
	 * @param {number} node 0-based point index	it can be -1
	 * @returns {boolean} true if point is valid
	 */
	public valid(node: number): boolean {
		//(i) => ((i = i | 0) >= 0 && i < points.length);
		//return (node = <any>node | 0) >= -1 && node < this.points.length;	// NOW ACCEPTS  -1
		//	-1  0  ... last  	   -> true
		//	"-1"  "0"  ... "last"  -> true
		//	""  "  "  "1."  "1a"   -> false
		return node >= -1   //String(Number(node)) == node
			&& node <= this.last;	// NOW ACCEPTS  -1
	}

	public appendNode(p: Point): boolean {
		return !this.editMode && (this.$.points.push(p), this.refresh(), true)
	}

	public setNode(node: number, p: IPoint): Wire {
		this.$.points[node].x = p.x | 0;
		this.$.points[node].y = p.y | 0;
		(node == 0) && moveToStart(this);
		return this.nodeRefresh(node);
	}

	public hghlightable(node: number): boolean {
		//any Wire node and that it is not a start|end bonded node
		return this.valid(node) //&& this.editMode
			&& (!(this.nodeBonds(node) && (node == 0 || node == this.last)))
	}

	public setPoints(points: IPoint[]): Wire {
		if (!isArr(points)
			|| points.length < 2)
			throw 'Poliwire min 2 points';
		if (!this.editMode) {
			this.$.points = points.map(p => new Point(p.x | 0, p.y | 0));
			moveToStart(this);
			this.$.lines = [];
			this.refresh();
		}
		return this
	}

	public getNode(node: number, onlyPoint?: boolean): INodeInfo | undefined {
		let
			p: Point = this.$.points[node];
		return p && { x: p.x, y: p.y, label: `node::${node}` }
	}

	public static nodeArea = 25;

	public overNode(p: IPoint, ln?: number): number {
		let
			inside = (np: IPoint): boolean => (Math.pow(p.x - np.x, 2) + Math.pow(p.y - np.y, 2)) <= Wire.nodeArea;
		if (ln) {
			//the fast way
			//lines are 1-based
			let
				p0 = this.$.points[ln - 1],
				p1 = this.$.points[ln]
			return (!p0 || !p1) ? -1 : inside(p0) ? ln - 1 : inside(p1) ? ln : -1
		}
		else {
			//the long way
			for (let i = 0, np = this.$.points[i], len = this.$.points.length;
				i < len; np = this.$.points[++i]) {
				//radius 5 =>  5^2 = 25
				if (inside(np))
					return i;
			}
			return -1
		}
	}

	public deleteLine(line: number): boolean {
		//cannot delete first or last line
		if (line <= 1 || line >= this.last)
			return false;
		let
			savedEditMode = this.editMode;
		this.editMode = false;
		deleteWireNode(this, line);
		deleteWireNode(this, line - 1);
		this.editMode = savedEditMode;
		return true;
	}

	public deleteNode(node: number): Point | undefined {
		let
			savedEditMode = this.editMode,
			p;
		this.editMode = false;
		p = deleteWireNode(this, node);
		this.editMode = savedEditMode;
		return p;
	}

	public insertNode(node: number, p: Point): boolean {
		//cannot insert node in first or after last position
		if (node <= 0 || node > this.last || isNaN(node))
			return false;
		let
			savedEditMode = this.editMode;
		this.editMode = false;
		//fix all bonds link indexes from last to this node
		for (let n = this.last; n >= node; n--) {
			this.container.moveBond(this.id, n, n + 1);
		}
		this.$.points.splice(node, 0, p);
		this.editMode = savedEditMode;
		return true;
	}

	/**
	 * @description standarizes a wire node number to 0..points.length
	 * @param {number} node 0-based can be -1:last 0..points.length-1
	 * @returns {number} -1 for wrong node or standarized node number, where -1 == last, otherwise node
	 */
	public standarizeNode(node: number): number {
		if (this.valid(node))
			return node == -1 ? this.last : <any>node;
		return -1;
	}

	public defaults(): IWireDefaults {
		return <IWireDefaults>extend(super.defaults(), {
			name: "wire",
			class: "wire",
			edit: false
		})
	}

}

function moveToStart(wire: Wire) {
	wire.move((<any>wire).$.points[0].x, (<any>wire).$.points[0].y)
}

function deleteWireNode(wire: Wire, node: number): Point | undefined {
	let
		last = wire.last;
	//first or last node cannot be deleted, only middle nodes
	if (node <= 0 || node >= last || isNaN(node))
		return;
	wire.unbondNode(node);
	wire.container.moveBond(wire.id, last, last - 1);
	return (<any>wire).$.points.splice(node, 1)[0];
}