import { IPoint } from "./interfaces";
import EC from "./ec";
import Container from "./container";
export default class Circuit extends Container<EC> {
    get name(): string;
    get library(): string;
    get directionalWires(): boolean;
    get ec(): EC | undefined;
    createItem(options: {
        name: string;
        x: number;
        y: number;
        points: IPoint[];
    }): EC;
    getXML(): string;
}
