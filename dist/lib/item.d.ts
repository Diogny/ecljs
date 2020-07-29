import { ISize, IItemBaseOptions } from "./interfaces";
import Point from "./point";
import { TypedClass } from "./types";
export default abstract class Item extends TypedClass {
    protected settings: IItemBaseOptions;
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
    propertyDefaults(): IItemBaseOptions;
}
