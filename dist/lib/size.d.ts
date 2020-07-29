import { ISize } from './interfaces';
export default class Size implements ISize {
    width: number;
    height: number;
    constructor(width: number, height: number);
    clone(): Size;
    round(): Size;
    static empty: Size;
    static create(size: ISize): Size;
    toString(options?: number): string;
}
