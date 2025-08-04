import { EC } from "./ec";
import { Container } from "./container";
/**
 * @description Circuits component container
 */
export class Circuit extends Container {
    get name() { return "circuit"; }
    get dir() { return false; }
    get ec() {
        return !this.selected.length ? void 0 : this.selected[0];
    }
    /**
     * @description creates a circuit compoents
     * @param options dictionary of options
     */
    createItem(options) {
        return new EC(this, options);
    }
}
