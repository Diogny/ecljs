import { EC } from "./ec";
import { Container } from "./container";

/**
 * @description Circuits component container
 */
export class Circuit extends Container<EC> {

  get name(): string { return "circuit" }
  get dir(): boolean { return false }

  get ec(): EC | undefined {
    return !this.selected.length ? void 0 : <EC>this.selected[0]
  }

  /**
   * @description creates a circuit compoents
   * @param options dictionary of options
   */
  public createItem(options: { [x: string]: any; }): EC {
    return new EC(this, <any>options);
  }

}
