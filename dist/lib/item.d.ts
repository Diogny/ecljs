import { IType, IItemDefaults, Type, Base } from "./interfaces";
import Point from "./point";
export default abstract class Item extends Base implements IType {
    protected $: IItemDefaults;
    abstract get type(): Type;
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
