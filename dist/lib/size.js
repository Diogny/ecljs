import { round } from './dab';
export default class Size {
    constructor(width, height) {
        this.width = parseFloat(width); //ensure it's a number
        this.height = parseFloat(height);
    }
    clone() { return new Size(this.width, this.height); }
    round() {
        this.width = Math.round(this.width);
        this.height = Math.round(this.height);
        return this;
    }
    static create(size) {
        return new Size(size.width, size.height);
    }
    toString(options) {
        let noVars = ((options = options | 0) & 4) != 0, noPars = (options & 2) != 0;
        return `${noPars ? "" : "("}${noVars ? "" : "w: "}${round(this.width, 1)}, ${noVars ? "" : "h: "}${round(this.height, 1)}${noPars ? "" : ")"}`;
    }
}
Size.empty = new Size(0, 0);
