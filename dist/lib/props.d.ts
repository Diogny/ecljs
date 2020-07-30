import { IUIPropertyOptions, IUIPropertySettings, IUIPropertyCallback, IUIProperty } from './interfaces';
export default class UIProp implements IUIProperty {
    protected settings: IUIPropertySettings;
    get id(): string;
    get type(): string;
    get name(): string;
    get tag(): string | Element;
    get html(): HTMLElement;
    get editable(): boolean;
    get nodeName(): string;
    get onChange(): IUIPropertyCallback | undefined;
    set onChange(fn: IUIPropertyCallback | undefined);
    get value(): number | string | string[];
    set value(val: number | string | string[]);
    constructor(options: IUIPropertyOptions);
    toString(): string;
    private selectionUiChanged;
    private static textOnly;
    private static _propId;
}