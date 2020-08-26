import { IPoint, IRect } from "./interfaces";
import { parse } from "./dab";

export default class Rect implements IRect {

	constructor(public x: number, public y: number, public width: number, public height: number) { }

	get empty(): boolean { return this.width < 0 || this.height < 0 }

	public inside(p: IPoint): boolean {
		return p.x >= this.x && p.y >= this.y && p.x <= (this.x + this.width) && p.y <= (this.y + this.height)
		// Point.inside(Point.minus(p, this.location), this.size)
	}

	//later reverse this, so this is modified, not r
	public intersect(r: Rect): boolean {
		let
			nx = Math.max(this.x, r.x),
			ny = Math.max(this.y, r.y);
		r.width = Math.min((this.x + this.width), (r.x + r.width)) - nx;
		r.height = Math.min((this.y + this.height), (r.y + r.height)) - ny;
		r.x = nx;
		r.y = ny;
		return !r.empty
	}

	public clone(): Rect { return Rect.create(this) }

	public contains(r: Rect): boolean {
		return r.x >= this.x
			&& r.y >= this.y
			&& (r.x + r.width <= this.x + this.width)
			&& (r.y + r.height <= this.y + this.height)
	}

	public add(r: Rect): Rect {
		let
			nx = Math.min(this.x, r.x),
			ny = Math.min(this.y, r.y);
		this.x = nx;
		this.y = ny;
		this.width = Math.max(this.x + this.width, r.x + r.width) - nx;
		this.height = Math.max(this.y + this.height, r.y + r.height) - ny;
		return this
	}

	public move(x: number, y: number) {
		this.x = x | 0;
		this.y = y | 0;
	}

	/**
	 * @description grow/shrink rectangle
	 * @param dx left & right growth
	 * @param dy top & bottom growth
	 */
	public grow(dx: number, dy: number): Rect {
		this.x -= (dx = dx | 0);
		this.y -= (dy = dy | 0);
		this.width += dx * 2;
		this.height += dy * 2;
		return this
	}

	public translate(tx: number, ty: number): Rect {
		this.x -= (tx = tx | 0);
		this.y -= (ty = ty | 0);
		return this
	}

	public equal(r: Rect): boolean { return this.x == r.x && this.y == r.y && this.width == r.width && this.height == r.height }

	static create(rect: IRect, toInt?: boolean): Rect {
		let
			r = new Rect(rect.x, rect.y, rect.width, rect.height);
		toInt && (r.x = r.x | 0, r.y = r.y | 0, r.width = r.width | 0, r.height = r.height | 0);
		return r
	}

	static get empty(): Rect { return new Rect(0, 0, 0, 0) }

	/**
	 * @description parse an string into an (x,y) Point
	 * @param value string in the for "x, y"
	 */
	static parse(value: string): Rect | undefined {
		let
			numbers = parse(value, 4);
		return numbers && new Rect(numbers[0], numbers[1], numbers[2], numbers[3])
	}

	public get str(): string { return `${this.x}, ${this.y}, ${this.width}, ${this.height}` }
}