import { IHighlightable } from "./interfaces";
import Point from "./point";
export default class BoardCircle implements IHighlightable {
    protected __s: IHighlightable;
    get visible(): boolean;
    get p(): Point;
    get nodeName(): string;
    get nodeValue(): number;
    get radius(): number;
    get g(): SVGCircleElement;
    constructor(nodeName: string);
    domRadius(): number;
    move(x: number, y: number): BoardCircle;
    setRadius(value: number): BoardCircle;
    hide(): BoardCircle;
    show(nodeValue: number): BoardCircle;
    private settings;
    refresh(): BoardCircle;
}
