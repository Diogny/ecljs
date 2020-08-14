//Point class is adapted from:
//https://github.com/Microsoft/TypeScriptSamples/blob/master/raytracer/raytracer.ts

import { IPoint, ISize } from './interfaces';
import { round, isNumeric } from './dab';

/**
 * @description a 2 dimension integer point class
 */
export default class Point implements IPoint {
	x: number;
	y: number;

	constructor(x: number, y: number) {
		this.x = Math.round(x);
		this.y = Math.round(y)
	}

	public distance(p: Point): number {
		var dx = this.x - p.x;
		var dy = this.y - p.y;
		return Math.sqrt(dx * dx + dy * dy);
	}

	public clone(): Point { return new Point(this.x, this.y) }

	public add(x: number, y: number): Point { return new Point(this.x + x, this.y + y) }

	public mul(x: number, y: number): Point { return new Point(this.x * x, this.y * y) }

	/**
	 * @description returns string of a Point oobject
	 * @param options 0 = x,y	1 = parenthesis; 	2 = variables x: x, y: y
	 */
	public toString(options?: number): string {
		let
			vars: boolean = ((options = <any>options | 0) & 2) != 0,
			pars: boolean = (options & 1) != 0;
		return `${pars ? "(" : ""}${vars ? "x: " : ""}${round(this.x, 1)}, ${vars ? "y: " : ""}${round(this.y, 1)}${pars ? ")" : ""}`
	}

	/**	
	 * @description returns quadrant of this point
	 * @returns 0 (0,0); -1 (x==0 or y ==0); 1 (y>0,x>0); 2 (y>0,x<0); 3 (y<0,x<0); 4 (y<0,x>0)
	 */
	public get quadrant(): number {
		if (this.x == 0 || this.y == 0) {
			return (this.x == this.y) ? 0 : -1;
		}
		if (this.y > 0)
			return (this.x > 0) ? 1 : 2
		else
			return (this.x < 0) ? 3 : 4
	}
	//get positive(): boolean { return this.x >= 0 && this.y >= 0 }

	/**
	 * @description rotatea a point (x,y) through center (x,y) by an angle
	 * @param {number} x x to rotate
	 * @param {number} y y to rotate
	 * @param {number} cx thru center x
	 * @param {number} cy thru center y
	 * @param {number} angle angle to rotate
	 */
	static rotateBy(x: number, y: number, cx: number, cy: number, angle: number): IPoint {
		var radians = (Math.PI / 180) * angle,
			cos = Math.cos(radians),
			sin = Math.sin(radians),
			nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
			ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
		return { x: nx | 0, y: ny | 0 }	//round(nx, 3), round(ny, 3)
	}

	//static
	static validateRotation(val: number): number {
		return (val = (val | 0) % 360, (val < 0) && (val += 360), val);
	}

	static get origin(): Point { return new Point(0, 0) }

	static create(p: IPoint) {
		return new Point(p.x, p.y)
	}

	/**
	 * @description parse an string into an (x,y) Point
	 * @param value string in the for "x, y"
	 */
	static parse(value: string): Point | undefined {
		let
			arr = value.split(",");
		if (arr.length == 2 && isNumeric(arr[0]) && isNumeric(arr[1])) {
			return new Point(parseInt(arr[0]), parseInt(arr[1]));
		}
		//invalid point
	}

	static scale(v: IPoint, k: number): Point { return new Point(k * v.x, k * v.y) }

	static translateBy(v: IPoint, dx: number, dy: number): Point { return new Point(v.x + dx, v.y + dy) }

	//static translate(v: Point, k: number): IPoint { return new Point(v.x + k, v.y + k) }
	static times(v: IPoint, scaleX: number, scaleY: number): Point { return new Point(v.x * scaleX, v.y * scaleY) }

	static minus(v1: IPoint, v2: IPoint): Point { return new Point(v1.x - v2.x, v1.y - v2.y) }

	static plus(v1: IPoint, v2: IPoint): Point { return new Point(v1.x + v2.x, v1.y + v2.y) }

	//
	static inside(p: IPoint, s: ISize): boolean { return p.x >= 0 && p.x <= s.width && p.y >= 0 && p.y <= s.height }
}