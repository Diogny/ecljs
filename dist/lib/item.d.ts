import { IType, ISize, IItemBaseOptions, Type, Base } from "./interfaces";
import Point from "./point";
export default abstract class Item extends Base implements IType {
    protected __s: IItemBaseOptions;
    abstract get type(): Type;
    get name(): string;
    get id(): string;
    get x(): number;
    get y(): number;
    get p(): Point;
    get class(): string;
    get visible(): boolean;
    abstract get ClientRect(): ISize;
    abstract get box(): any;
    constructor(options: IItemBaseOptions);
    setVisible(value: boolean): Item;
    move(x: number, y: number): Item;
    movePoint(p: Point): Item;
    translate(dx: number, dy: number): Item;
    defaults(): IItemBaseOptions;
}
