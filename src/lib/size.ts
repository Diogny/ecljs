import { ISize } from './interfaces';
import { round, isNumeric } from './dab';

export default class Size implements ISize {
	public width: number;
	public height: number;

	constructor(width: number, height: number) {
		this.width = parseFloat(<any>width);	//ensure it's a number
		this.height = parseFloat(<any>height);
	}

	public clone(): Size { return new Size(this.width, this.height) }

	public round(): Size {
		this.width = Math.round(this.width);
		this.height = Math.round(this.height);
		return this
	}

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
			arr = value.split(",");
		if (arr.length == 2 && isNumeric(arr[0]) && isNumeric(arr[1])) {
			return new Size(parseInt(arr[0]), parseInt(arr[1]));
		}
		//invalid size
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
}