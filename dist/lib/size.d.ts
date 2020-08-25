import { ISize } from './interfaces';
export default class Size implements ISize {
    width: number;
    height: number;
    constructor(width: number, height: number);
    clone(): Size;
    equal(size: Size): boolean;
    /**
     * @description returns true if both width & height are positive
     */
    get positive(): boolean;
    static get empty(): Size;
    static create(size: ISize): Size;
    /**
     * @description parse an string into an (x,y) Size
     * @param value string in the for "width, height"
     */
    static parse(value: string): Size | undefined;
    /**
     * returns string of a Size oobject
     * @param options  0 = width,height	1 = parenthesis	2 = short variables w: width, h: height	4 = long variables (width: width, height: height)
     */
    toString(options?: number): string;
    get str(): string;
}
