import { IUIPropertyOptions, IUIPropertySettings, IUIPropertyCallback, IUIProperty, Base, IPropContainerProperties, IHookOptions } from './interfaces';
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
    get react(): boolean;
    get onChange(): IUIPropertyCallback | undefined;
    set onChange(fn: IUIPropertyCallback | undefined);
    get value(): any;
    set value(val: any);
    constructor(options: IUIPropertyOptions);
    destroy(): void;
    private trigger;
    defaults(): IUIPropertySettings;
}
export declare class PropContainer extends Base {
    protected __s: IPropContainerProperties;
    get root(): {
        [id: string]: {
            value: any;
            prop: UIProp;
            modified: boolean;
        };
    };
    get modified(): boolean;
    constructor(props: {
        [id: string]: IHookOptions;
    });
    defaults(): IPropContainerProperties;
}
