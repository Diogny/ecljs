import { EC } from "./ec";
import { Container } from "./container";
/**
 * @description Circuits component container
 */
export declare class Circuit extends Container<EC> {
    get name(): string;
    get dir(): boolean;
    get ec(): EC | undefined;
    /**
     * @description creates a circuit compoents
     * @param options dictionary of options
     */
    createItem(options: {
        [x: string]: any;
    }): EC;
}
