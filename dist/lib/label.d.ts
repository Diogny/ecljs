import { ISize } from "dabbjs/dist/lib/interfaces";
import { Type, ILabelDefaults } from "./interfaces";
import ItemBase from "./itemsBase";
export default class Label extends ItemBase {
    get type(): Type;
    protected $: ILabelDefaults;
    get text(): string;
    get size(): ISize;
    get fontSize(): number;
    constructor(options: {
        [x: string]: any;
    });
    move(x: number, y: number): Label;
    setFontSize(value: number): Label;
    defaults(): ILabelDefaults;
}
