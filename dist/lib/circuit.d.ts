import EC from "./ec";
import Container from "./container";
export default class Circuit extends Container<EC> {
    get library(): string;
    get directionalWires(): boolean;
    get ec(): EC | undefined;
    createItem(options: {
        [x: string]: any;
    }): EC;
}
