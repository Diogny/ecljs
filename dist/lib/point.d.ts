import { IPoint, ISize } from './interfaces';
/**
 * @description a 2 dimension integer point class
 */
export default class Point implements IPoint {
    x: number;
    y: number;
    constructor(x: number, y: number);
    /**
     * @description calculates distance from this point to another
     * @param p point
     */
    distance(p: Point): number;
    /**
     * @description clones point
     */
    clone(): Point;
    /**
     * @description returns a new point shifted by (x,y) vector
     * @param x vector x
     * @param y vector y
     */
    add(x: number, y: number): Point;
    /**
     * @description scales this point by a multiple (x,y)
     * @param x mul x
     * @param y mul y
     */
    mul(x: number, y: number): Point;
    /**
     * @description equality comparer
     * @param p point
     */
    equal(p: Point): boolean;
    /**
     * @description returns string of a Point oobject
     * @param options 0 = x,y	1 = parenthesis; 	2 = variables x: x, y: y
     */
    toString(options?: number): string;
    get str(): string;
    /**
     * @description returns quadrant of this point
     * @returns 0 (0,0); -1 (x==0 or y ==0); 1 (y>0,x>0); 2 (y>0,x<0); 3 (y<0,x<0); 4 (y<0,x>0)
     */
    get quadrant(): number;
    /**
     * @description rotatea a point (x,y) through center (x,y) by an angle
     * @param {number} x x to rotate
     * @param {number} y y to rotate
     * @param {number} cx thru center x
     * @param {number} cy thru center y
     * @param {number} angle angle to rotate
     */
    static rotateBy(x: number, y: number, cx: number, cy: number, angle: number): IPoint;
    static validateRotation(val: number): number;
    static get origin(): Point;
    static create(p: IPoint): Point;
    /**
     * @description parse an string into an (x,y) Point
     * @param value string in the for "x, y"
     */
    static parse(value: string): Point | undefined;
    static scale(v: IPoint, k: number): Point;
    static translateBy(v: IPoint, dx: number, dy: number): Point;
    static times(v: IPoint, scaleX: number, scaleY: number): Point;
    static minus(v1: IPoint, v2: IPoint): Point;
    static plus(v1: IPoint, v2: IPoint): Point;
    static inside(p: IPoint, s: ISize): boolean;
}
