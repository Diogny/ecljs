import ItemBase from "./itemsBase";
import { Type } from "./types";
import { ITooltipSettings, ISize, ILabelText } from "./interfaces";
export default class Label extends ItemBase {
    get type(): Type;
    protected settings: ITooltipSettings;
    protected t: SVGTextElement;
    text: string;
    get size(): ISize;
    get fontSize(): number;
    constructor(options: ILabelText);
    move(x: number, y: number): Label;
    setFontSize(value: number): Label;
    protected build(): Label;
    setText(value: string): Label;
    propertyDefaults(): ILabelText;
}
