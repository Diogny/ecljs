import { Type, ITooltipSettings, ISize, ILabelText } from "./interfaces";
import ItemBase from "./itemsBase";
export default class Label extends ItemBase {
    get type(): Type;
    protected __s: ITooltipSettings;
    protected t: SVGTextElement;
    text: string;
    get size(): ISize;
    get fontSize(): number;
    constructor(options: ILabelText);
    move(x: number, y: number): Label;
    setFontSize(value: number): Label;
    protected build(): Label;
    setText(value: string): Label;
    defaults(): ILabelText;
}
