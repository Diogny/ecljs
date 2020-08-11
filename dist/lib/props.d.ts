import { IUIPropertyOptions, IUIPropertySettings, IUIPropertyCallback, IUIProperty, Base } from './interfaces';
export declare class UIProp extends Base implements IUIProperty {
    protected __s: IUIPropertySettings;
    get type(): string;
    get tag(): string | Element;
    get html(): HTMLElement;
    get editable(): boolean;
    get data(): {
        [id: string]: any;
    };
    get nodeName(): string;
    get onChange(): IUIPropertyCallback | undefined;
    set onChange(fn: IUIPropertyCallback | undefined);
    get value(): number | boolean | string | string[];
    set value(val: number | boolean | string | string[]);
    constructor(options: IUIPropertyOptions);
    destroy(): void;
    private trigger;
    defaults(): IUIPropertySettings;
    static container(props: {
        [id: string]: IUIPropertyOptions;
    }): {
        [id: string]: UIHook;
    };
}
export declare class UIHook {
    prop: UIProp;
    constructor(prop: UIProp);
    get value(): number | boolean | string | string[];
    set value(value: number | boolean | string | string[]);
}
