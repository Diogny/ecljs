import { ISize } from 'dabbjs/dist/lib/interfaces';
import { Type, ITooltipDefaults } from "./interfaces";
import { Label } from './label';
export declare class Tooltip extends Label {
    get type(): Type;
    protected $: ITooltipDefaults;
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
