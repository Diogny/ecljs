import Point from "dabbjs/dist/lib/point";
import { IItemDefaults, Base } from "./interfaces";
export default abstract class Item extends Base {
    protected $: IItemDefaults;
    get name(): string;
    get id(): string;
    get x(): number;
    get y(): number;
    get p(): Point;
    get class(): string;
    get visible(): boolean;
    constructor(options: {
        [x: string]: any;
    });
    setVisible(value: boolean): Item;
    move(x: number, y: number): Item;
    movePoint(p: Point): Item;
    translate(dx: number, dy: number): Item;
    defaults(): IItemDefaults;
}
