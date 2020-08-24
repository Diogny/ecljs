import EC from "./ec";
import Container from "./container";
export default class Circuit extends Container<EC> {
    get name(): string;
    get dir(): boolean;
    get ec(): EC | undefined;
    createItem(options: {
        [x: string]: any;
    }): EC;
}
