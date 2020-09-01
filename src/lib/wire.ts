import { IPoint } from 'dabbjs/dist/lib/interfaces';
import { attr, isArr, extend } from 'dabbjs/dist/lib/dab';
import { tag } from 'dabbjs/dist/lib/utils';
import Point from 'dabbjs/dist/lib/point';
import Rect from 'dabbjs/dist/lib/rect';
import { Type, IWireDefaults, INodeInfo } from './interfaces';
import ItemBoard from './itemsBoard';
import Container from './container';

export default class Wire extends ItemBoard {

	protected $: IWireDefaults;

	get type(): Type { return Type.WIRE }

	get count(): number { return this.$.points.length }

	get last(): number { return this.$.points.length - 1 }

	get lastLine(): number { return this.edit ? this.$.lines.length : 0 }

	get isOpen(): boolean { return !this.nodeBonds(0) || !this.nodeBonds(this.last) }

	public rect(): Rect { return Rect.create(this.box) }

	get points(): Point[] { return Array.from(this.$.points) }

	get edit(): boolean { return this.$.edit }

	/**	
	 * @description get/set wire edit mode
	 */
	set edit(value: boolean) {
		if (this.edit == value)
			return;
		this.g.innerHTML = "";
		this.$.dir && (this.$.arrow = poly(this.g, "arrow", -1));
		if (this.edit) {
			//	will change to false
			//		.destroy lines
			this.$.lines = [];
			//		.recreate polyline
			this.$.poly = poly(this.g);
		} else {
			//	will change to true
			//		.destroy polyline
			this.$.poly = <any>void 0;
			//		.recreate lines
			setlines(this, this.$);
		}
		//has to be at the end, because logic
		this.$.edit = value;
		//refresh only with polyline
		!value && this.refresh();
	}

	get head(): number { return this.$.headLength }
	get swipe(): number { return this.$.headAngle }

	/**
	 * @description customize arrow for directional wires only
	 * @param length arrow line length
	 * @param angle arrow lines swipe angle
	 */
	public arrow(length: number, angle: number) {
		if (!this.$.dir)
			return
		this.$.headLength = length;
		this.$.headAngle = angle;
		arrow(this.$)
	}

	constructor(container: Container<ItemBoard>, options: { [x: string]: any; }) {
		super(container, options);
		this.$.dir = container.dir;
		this.setPoints(options.points);
		this.onProp && this.onProp({
			id: `#${this.id}`,
			code: 1					// "create" code = 1
		})
	}

	public refresh(): Wire {
		if (this.edit) {
			for (let i = 0, a = this.$.points[0], last = this.last; i < last; i++) {
				let
					b = this.$.points[i + 1],
					ln = this.$.lines[i];
				attr(ln, {
					line: i + 1,
					x1: a.x,
					y1: a.y,
					x2: b.x,
					y2: b.y
				});
				a = b
			}
		}
		else
			attr(this.$.poly, {
				points: this.$.points.map(p => `${p.x}, ${p.y}`).join(' ')
			});
		arrow(this.$);	//	full-refresh
		return this;
	}

	public nodeRefresh(node: number): Wire {
		if (this.edit) {
			let
				ln: SVGElement,
				p = this.$.points[node];
			(ln = this.$.lines[node - 1]) && attr(ln, { x2: p.x, y2: p.y });
			(ln = this.$.lines[node]) && attr(ln, { x1: p.x, y1: p.y });
			arrow(this.$, node);	// partial-refresh
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
		return this
	}

	public setNode(node: number, p: IPoint): Wire {
		this.$.points[node].x = p.x | 0;
		this.$.points[node].y = p.y | 0;
		(node == 0) && moveToStart(this.$);
		this.refreshHighlight(node);
		return this.nodeRefresh(node)
	}

	public translate(dx: number, dy: number): Wire {
		super.translate(dx, dy);
		//don't translate bonded end points because it should have been|will be moved by bonded EC or Wire
		let
			savededit = this.edit;
		this.edit = false;
		for (let i = 0, p = this.$.points[i], end = this.last; i <= end; p = this.$.points[++i]) {
			//avoid circular reference, bonded start/end nodes are refresed by EC's nodes
			if ((i > 0 && i < end) || ((i == 0 || i == end) && !this.nodeBonds(i))) {
				this.setNode(i, Point.translateBy(p, dx, dy));
			}
		}
		this.edit = savededit;
		arrow(this.$);		// full-refresh
		return this
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
		return node >= 0 //-1   //String(Number(node)) == node
			&& node <= this.last;	// NOW ACCEPTS  -1
	}

	/**
	 * @description appends a new node at the end, only works in edit mode, creating a wire
	 * @param p new point
	 */
	public append(p: Point): boolean {
		//only works in edit mode = false, so far
		return !this.edit && (this.$.points.push(p), this.refresh(), true)
	}

	public highlightable(node: number): boolean {
		//any Wire node and that it is not a start|end bonded node
		return !((node == 0 || node == this.last) && this.nodeBonds(node))
	}

	protected setPoints(points: IPoint[]): Wire {
		if (!isArr(points)
			|| points.length < 2)
			throw 'wire min 2 points';
		//cleanup
		this.g.innerHTML = "";
		this.$.points = points.map(p => new Point(p.x | 0, p.y | 0));
		this.$.dir && (this.$.arrow = poly(this.g, "arrow", -1));
		moveToStart(this.$);
		if (this.edit) {
			this.$.poly = <any>void 0;
			setlines(this, this.$)
		} else {
			this.$.lines = [];
			this.$.poly = poly(this.g);
			this.refresh();
		}
		return this
	}

	/**
	 * @description returns the node information
	 * @param node 0-based pin/node number
	 * @param onlyPoint it's discarded
	 * 
	 * this returns absolute (x, y) position
	 */
	public node(node: number, onlyPoint?: boolean): INodeInfo | undefined {
		let
			p: Point = this.$.points[node];
		return p && { x: p.x, y: p.y, label: `node::${node}` }
	}

	public static nodeArea = 25;

	/**
	 * @description detects a point over a node
	 * @param p point to check for component node
	 * @param ln 1-based line number, ln undefined or 0, checks the whole wire, otherwise just check this line
	 */
	public over(p: IPoint, ln?: number): number {
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
		deleteWireNode(this, this.$, line);
		deleteWireNode(this, this.$, line - 1);
		this.refresh();
		this.highlight(false);
		return true
	}

	public deleteNode(node: number): Point | undefined {
		let
			p = deleteWireNode(this, this.$, node);
		this.refresh();
		this.highlight(false);
		return p
	}

	public insertNode(node: number, p: Point): boolean {
		//cannot insert node in first or after last position
		if (node <= 0 || node > this.last || isNaN(node))
			return false;
		//fix all bonds link indexes from last to this node
		for (let n = this.last; n >= node; n--) {
			this.container.moveBond(this.id, n, n + 1);
		}
		this.$.points.splice(node, 0, p);
		if (this.edit) {
			let
				newline = line(0, Point.origin, Point.origin);
			this.g.insertBefore(newline, this.$.lines[0]);
			//this's for ARROW next to last
			this.$.lines.unshift(newline)
		}
		this.refresh();
		this.highlight(false);
		return true
	}

	/**
	 * @description standarizes a wire node number to 0..points.length
	 * @param {number} node 0-based can be -1:last 0..points.length-1
	 * @returns {number} -1 for wrong node or standarized node number, where -1 == last, otherwise node
	 */
	public standarizeNode(node: number): number {
		if (this.valid(node))
			return node == -1 ? this.last : <any>node;
		return -1
	}

	public defaults(): IWireDefaults {
		return <IWireDefaults>extend(super.defaults(), {
			name: "wire",
			class: "wire",
			edit: false,
			head: 14,
			headAngle: 0.78
		})
	}

}

function moveToStart($: IWireDefaults) {
	$.x = $.points[0].x;
	$.y = $.points[0].y
}

function deleteWireNode(wire: Wire, $: IWireDefaults, node: number): Point | undefined {
	let
		last = wire.last;
	//first or last node cannot be deleted, only middle nodes
	if (node <= 0 || node >= last || isNaN(node))
		return;
	wire.unbondNode(node);
	wire.container.moveBond(wire.id, last, last - 1);
	let
		p = $.points.splice(node, 1)[0];
	if (wire.edit) {
		wire.g.removeChild($.lines[0]);
		//use shift for ARROW next to last line
		$.lines.shift();
	}
	return p
}

function line(ln: number, a: Point, b: Point, arrow?: boolean): SVGLineElement {
	let
		options = {
			line: ln,
			x1: a.x,
			y1: a.y,
			x2: b.x,
			y2: b.y
		};
	return !arrow && (options["svg-type"] = "line"), <SVGLineElement>tag("line", "", options)
}

function setlines(w: Wire, $: IWireDefaults) {
	$.lines = [];
	for (let i = 0, a = $.points[0], last = w.last; i < last; i++) {
		let
			b = $.points[i + 1],
			ln = line(i + 1, a, b);
		$.lines.push(ln);
		w.g.append(ln);
		a = b;
	}
	arrow($)
}

function poly(g: SVGElement, type?: string, line?: number): SVGPolylineElement {
	let
		polyline = <SVGPolylineElement>tag("polyline", "", {
			"svg-type": type || "line",
			line: line || "0",
			points: "",
		});
	return g.append(polyline), polyline
}

/**
 * 
 * @param $ wire internal data
 * @param node 0-based node to be refreshed.
 * 
 * node == undefined, then draw arrow if wire is directional
 * node != undefined, only draw arrow if node is prev|last node for a directional wire
 */
function arrow($: IWireDefaults, node?: number) {
	if (!$.dir)
		return;
	let
		c = $.points.length - 1,
		last = $.points[c],
		prev = $.points[c - 1],
		r = $.headLength,
		angle = Math.atan2(last.y - prev.y, last.x - prev.x),
		swipe = $.headAngle,
		p = (ang: number) => new Point((last.x - r * Math.cos(ang)) | 0, (last.y - r * Math.sin(ang)) | 0);
	//if node is defined, only redraw arrow when node is prev|last node of wire
	if (node != undefined && !(node == c || node == c - 1))
		return;
	attr($.arrow, {
		points: [p(angle - swipe), last, p(angle + swipe)].map(p => `${p.x}, ${p.y}`).join(' ')
	})
}