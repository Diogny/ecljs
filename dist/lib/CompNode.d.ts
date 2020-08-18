import { IBoardCircleDefaults } from "./interfaces";
import Point from "./point";
import Item from "./item";
export default class CompNode extends Item {
    protected $: IBoardCircleDefaults;
    get p(): Point;
    get node(): number;
    get radius(): number;
    get g(): SVGCircleElement;
    constructor(options: {
        [id: string]: any;
    });
    move(x: number, y: number): CompNode;
    setVisible(value: boolean): CompNode;
    setRadius(value: number): CompNode;
    refresh(): CompNode;
    defaults(): IBoardCircleDefaults;
}
