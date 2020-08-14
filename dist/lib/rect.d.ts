import { IPoint, IRect } from "./interfaces";
export default class Rect implements IRect {
    x: number;
    y: number;
    width: number;
    height: number;
    constructor(x: number, y: number, width: number, height: number);
    get empty(): boolean;
    inside(p: IPoint): boolean;
    intersect(r: Rect): boolean;
    clone(): Rect;
    contains(r: Rect): boolean;
    add(r: Rect): void;
    move(x: number, y: number): void;
    grow(dx: number, dy: number): void;
    static create(r: IRect): Rect;
    static get empty(): Rect;
}
