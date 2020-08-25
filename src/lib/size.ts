import { ISize } from './interfaces';
import { round, isNumeric, parse } from './dab';

export default class Size implements ISize {
	public width: number;
	public height: number;

	constructor(width: number, height: number) {
		this.width = Math.round(width);
		this.height = Math.round(height)
	}

	public clone(): Size { return new Size(this.width, this.height) }

	public equal(size: Size): boolean { return this.width == size.width && this.height == size.height }

	/**	
	 * @description returns true if both width & height are positive
	 */
	get positive(): boolean { return this.width >= 0 && this.height >= 0 }

	static get empty(): Size { return new Size(0, 0) }

	static create(size: ISize): Size {
		return new Size(size.width, size.height)
	}

	/**
	 * @description parse an string into an (x,y) Size
	 * @param value string in the for "width, height"
	 */
	static parse(value: string): Size | undefined {
		let
			numbers = parse(value, 2);
		return numbers && new Size(numbers[0], numbers[1])
	}

	/**
	 * returns string of a Size oobject
	 * @param options  0 = width,height	1 = parenthesis	2 = short variables w: width, h: height	4 = long variables (width: width, height: height)
	 */
	public toString(options?: number): string {
		let
			pars: boolean = ((options = <any>options | 0) & 1) != 0,
			shortVars: boolean = (options & 2) != 0,
			longVars: boolean = (options & 4) != 0,
			width = () => shortVars ? "w: " : longVars ? "width: " : "",
			height = () => shortVars ? "h: " : longVars ? "height: " : "";
		return `${pars ? "(" : ""}${width()}${round(this.width, 1)}, ${height()}${round(this.height, 1)}${pars ? ")" : ""}`
	}

	public get str(): string { return `${this.width}, ${this.height}` }

}