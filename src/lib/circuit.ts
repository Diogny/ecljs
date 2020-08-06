import { IPoint } from "./interfaces";
import EC from "./ec";
import Container from "./container";

export default class Circuit extends Container<EC> {

	get name(): string { return "Circuit" }
	get library(): string { return "circuit" }
	get directionalWires(): boolean { return false }

	get ec(): EC | undefined {
		return !this.selected.length ? void 0 : <EC>this.selected[0]
	}

	public createItem(options: { name: string, x: number, y: number, points: IPoint[] }): EC {
		return new EC(this, <any>options);
	}

}
