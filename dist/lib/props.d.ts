import { IUIPropertyCallback, Base, IPropContainerDefaults, IReactPropDefaults, IUIPropertyDefaults, IReactProp, IPropHook } from './interfaces';
export declare class ReactProp extends Base implements IReactProp {
    protected $: IReactPropDefaults;
    /**
     * @description returns an object [key]::any with the property inside data
     */
    get _(): {
        [id: string]: any;
    };
    /**
     * @description get/set the value of the react property
     */
    get value(): any;
    /**
     * @param {any} val setters new value
     */
    set value(val: any);
    /**
     * @description creates a react property
     * @param options [key]::value object as description
     *
     * valid [options] are:
     * - value: property default value, default is undefined.
     * - _: [key]::value object with internal data
     * - onChange: (value: any, where: number, prop: IReactProp, e: any): any | void
     */
    constructor(options: {
        [id: string]: any;
    });
    dispose(): void;
    /**
     * @description onchange event (value: any, where: number, prop: IReactProp, e: any): any | void
     *
     */
    onChange: IUIPropertyCallback | undefined;
    /**
     * @description class property defaults. Only these keys are copied internally
     */
    defaults(): IReactPropDefaults;
}
export declare class UIProp extends ReactProp {
    protected $: IUIPropertyDefaults;
    get type(): string;
    get html(): HTMLElement;
    get editable(): boolean;
    get tag(): string | Element;
    get nodeName(): string;
    get react(): boolean;
    /**
     * @description creates a react UI property
     * @param options [key]::value object as description
     *
     * valid [options] are:
     * - tag: this's required as a valid DOM selector query
     * - value: property default value, default is undefined.
     * - _: [key]::value object with internal data
     * - onChange: (value: any, where: number, prop: IReactProp, e: any): any | void
     */
    constructor(options: {
        [id: string]: any;
    });
    get value(): any;
    set value(val: any);
    dispose(): void;
    private trigger;
    /**
     * @description class property defaults. Only these keys are copied internally
     */
    defaults(): IUIPropertyDefaults;
}
export declare class PropContainer extends Base {
    protected $: IPropContainerDefaults;
    get props(): {
        [id: string]: IPropHook;
    };
    get modified(): boolean;
    set modified(value: boolean);
    /**
     * @description creates a property container
     * @param props [key]::value object
     *
     * [key] is property name, ::value is valid prop [options]:
     * - value: set prop default value.
     * - _: [key]::value object with internal data
     * - onChange: (value: any, where: number, prop: IReactProp, e: any): any | void
     * - modify: triggers container modified, default to true
     */
    constructor(props: {
        [id: string]: {
            [id: string]: any;
        };
    });
    /**
     * @description class property defaults. Only these keys are copied internally
     */
    defaults(): IPropContainerDefaults;
}
