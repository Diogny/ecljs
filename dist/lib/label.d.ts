import { Type, ISize, ILabelDefaults } from "./interfaces";
import ItemBase from "./itemsBase";
export default class Label extends ItemBase {
    get type(): Type;
    protected __s: ILabelDefaults;
    get text(): string;
    get size(): ISize;
    get fontSize(): number;
    constructor(options: {
        [x: string]: any;
    });
    move(x: number, y: number): Label;
    setFontSize(value: number): Label;
    protected build(): Label;
    setText(value: string): Label;
    defaults(): ILabelDefaults;
}
