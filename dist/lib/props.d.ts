import { IUIPropertyCallback, Base, IPropContainerDefaults, IReactPropDefaults, IUIPropertyDefaults, IReactProp, IPropHook } from './interfaces';
export declare class ReactProp extends Base implements IReactProp {
    protected __s: IReactPropDefaults;
    get data(): {
        [id: string]: any;
    };
    get value(): any;
    set value(val: any);
    constructor(options: {
        [id: string]: any;
    });
    dispose(): void;
    onChange: IUIPropertyCallback | undefined;
    defaults(): IReactPropDefaults;
}
export declare class UIProp extends ReactProp {
    protected __s: IUIPropertyDefaults;
    get type(): string;
    get html(): HTMLElement;
    get editable(): boolean;
    get tag(): string | Element;
    get nodeName(): string;
    get react(): boolean;
    get value(): any;
    set value(val: any);
    constructor(options: {
        [id: string]: any;
    });
    dispose(): void;
    private trigger;
    defaults(): IUIPropertyDefaults;
}
export declare class PropContainer extends Base {
    protected __s: IPropContainerDefaults;
    get root(): {
        [id: string]: IPropHook;
    };
    get modified(): boolean;
    set modified(value: boolean);
    constructor(props: {
        [id: string]: {
            [id: string]: any;
        };
    });
    defaults(): IPropContainerDefaults;
}
