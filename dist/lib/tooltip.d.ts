import { Type, ISize, ITooltipDefaults } from "./interfaces";
import Label from './label';
export default class Tooltip extends Label {
    get type(): Type;
    protected __s: ITooltipDefaults;
    get borderRadius(): number;
    get size(): ISize;
    constructor(options: {
        [x: string]: any;
    });
    setVisible(value: boolean): Label;
    setBorderRadius(value: number): Tooltip;
    protected build(): Tooltip;
    setText(value: string | any[]): Tooltip;
    defaults(): ITooltipDefaults;
}
