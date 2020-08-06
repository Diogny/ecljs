import { Type, ITooltipText, ISize, ITooltipSettings } from "./interfaces";
import Label from './label';
export default class Tooltip extends Label {
    protected settings: ITooltipSettings;
    private svgRect;
    private gap;
    get type(): Type;
    get borderRadius(): number;
    get size(): ISize;
    constructor(options: ITooltipText);
    setVisible(value: boolean): Label;
    setBorderRadius(value: number): Tooltip;
    protected build(): Tooltip;
    setText(value: string | any[]): Tooltip;
    propertyDefaults(): ITooltipText;
}
