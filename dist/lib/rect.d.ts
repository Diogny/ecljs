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
    equal(r: Rect): boolean;
    static create(r: IRect): Rect;
    static get empty(): Rect;
    /**
     * @description parse an string into an (x,y) Point
     * @param value string in the for "x, y"
     */
    static parse(value: string): Rect | undefined;
    get str(): string;
}
