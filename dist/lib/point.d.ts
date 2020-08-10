import { IPoint, ISize } from './interfaces';
/**
 * @description a 2 dimension integer point class
 */
export default class Point implements IPoint {
    x: number;
    y: number;
    constructor(x: number, y: number);
    distance(p: Point): number;
    clone(): Point;
    add(x: number, y: number): Point;
    mul(x: number, y: number): Point;
    /**
     * @description returns string of a Point oobject
     * @param options 0 = x,y	1 = parenthesis; 	2 = variables x: x, y: y
     */
    toString(options?: number): string;
    /**
     * @description returns quadrant of this point
     * @returns 0 (0,0); -1 (x==0 or y ==0); 1 (y>0,x>0); 2 (y>0,x<0); 3 (y<0,x<0); 4 (y<0,x>0)
     */
    get quadrant(): number;
    /**
     * @description rotate (x,y) through center (x,y) by an angle
     * @param {number} cx center x
     * @param {number} cy center y
     * @param {number} angle angle to rotate
     */
    rotateBy(cx: number, cy: number, angle: number): Point;
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
