import { IPoint, ISize } from './interfaces';
export default class Point implements IPoint {
    x: number;
    y: number;
    constructor(x: number, y: number);
    distance(p: Point): number;
    clone(): Point;
    round(): Point;
    add(x: number, y: number): Point;
    toString(options?: number): string;
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
    static parse(value: string): Point;
    static distance(p1: Point, p2: Point): number;
    static scale(v: IPoint, k: number): Point;
    static translateBy(v: IPoint, dx: number, dy: number): Point;
    static times(v: IPoint, scaleX: number, scaleY: number): Point;
    static minus(v1: IPoint, v2: IPoint): Point;
    static plus(v1: IPoint, v2: IPoint): Point;
    static inside(p: IPoint, s: ISize): boolean;
}
