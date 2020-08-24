declare const c: any;
export { c as consts };
export declare const ts: (t: any) => any;
export declare const empty: (s: any) => boolean;
export declare const typeOf: (o: any) => any;
export declare const isFn: (f: any) => boolean;
export declare const dfnd: (t: any) => boolean;
export declare const isStr: (s: any) => boolean;
export declare const isObj: (t: any) => boolean;
export declare const isArr: (t: any) => boolean;
export declare const isNum: (n: any) => boolean;
export declare const isNumeric: (n: any) => boolean;
export declare const isInt: (n: any) => boolean;
export declare const pInt: (s: string, mag?: number | undefined) => number;
export declare const clamp: (v: number, min: number, max: number) => number;
export declare const round: (v: number, decimals: number) => number;
export declare const splat: <T>(o: any) => T[];
export declare const extend: (obj: {
    [id: string]: any;
}, src: {
    [id: string]: any;
}) => {
    [id: string]: any;
};
export declare const copy: (obj: {
    [id: string]: any;
}, src: {
    [id: string]: any;
}) => {
    [id: string]: any;
};
export declare const inherit: (parent: any, child: any) => void;
/**
 * @description returns true if an element if an HTML or SVG DOM element
 * @param e {any} an element
 */
export declare const isDOM: (e: any) => boolean;
export declare const pojo: (arg: any) => boolean;
export declare const obj: (o: any) => any;
export declare const clone: <T>(o: T) => T;
export declare const defEnum: (e: any) => any;
export declare const css: (el: any, styles: any) => any;
export declare const attr: (el: any, attrs: any) => any;
/**
 * @description adds an event listener to an element
 * @param el element
 * @param eventName event name
 * @param fn
 * @param b
 */
export declare const aEL: (el: HTMLElement, eventName: string, fn: Function, b?: boolean | AddEventListenerOptions | undefined) => void;
/**
 * @description removes an event listener to an element
 * @param el element
 * @param eventName event name
 * @param fn
 * @param b
 */
export declare const rEL: (el: HTMLElement, eventName: string, fn: Function, b?: boolean | AddEventListenerOptions | undefined) => void;
/**
 * @description defines a new object property
 * @param obj object
 * @param propName property name
 * @param attrs attributes
 */
export declare const dP: (obj: any, propName: string, attrs: object) => any;
/**
 * @description appends a child element to it's new parent
 * @param parent parent element
 * @param child child element
 */
export declare const aChld: (parent: any, child: any) => any;
/**
 * @description test for class
 * @param el Element
 * @param className className cannot contain spaces
 * @returns true if present, false otherwise
 */
export declare const hCl: (el: Element, className: string) => boolean;
/**
 * @description adds a class to an Element
 * @param el Element
 * @param className className cannot contain spaces
 */
export declare const aCl: (el: Element, className: string) => void;
/**
 * @description removes a class from an Element
 * @param el Element
 * @param className className cannot contain spaces
 */
export declare const rCl: (el: Element, className: string) => void;
/**
 * @description toggles a class from an Element
 * @param el Element
 * @param className className cannot contain spaces
 * @param force undefined is toggle, true is add, false is remove
 * @returns true if present, false if not
 */
export declare const tCl: (el: Element, className: string, force?: boolean | undefined) => boolean;
export declare const range: (s: number, e: number) => number[];
export declare const unique: (x: any[]) => any[];
export declare const union: (x: any[], y: any[]) => any[];
export declare const aClx: (el: Element, className: string) => Element;
export declare const selectMany: <TIn, TOut>(input: TIn[], selectListFn: (t: TIn) => TOut[]) => TOut[];
export declare const toBool: (val: any) => boolean;
export declare const parse: (s: string, l: number) => number[] | undefined;
