export declare const DOMTemplates: () => {
    [key: string]: any;
};
export declare const pad: (t: string, e: number, ch?: any) => string;
export declare const fillChar: (ch: string, len: number) => string;
export declare const padStr: (s: string, width: number) => string;
export declare const formatNumber: (n: number, width: number) => string;
export declare const tag: (tagName: string, id: string, nsAttrs: any) => SVGElement;
export declare const svg: (html: string) => Element;
export declare const html: (html: string) => ChildNode;
export declare const each: (obj: any, fn: (value: any, key: string, ndx: number) => void) => void;
export declare const map: (obj: any, fn: (value: any, key: string, ndx: number) => any) => any[];
export declare const filter: (obj: any, fn: (value: any, key: string, ndx: number) => any) => any;
/**
 * @description
 * @param obj an object to filter
 * @param fn if it returns true array[]= value (key is lost), if object array[] = object, otherwise discarded
 */
export declare const filterArray: (obj: any, fn: (value: any, key: string, ndx: number) => any) => any[];
export declare const prop: (o: any, path: string, value?: any) => any;
export declare const ready: (fn: Function) => boolean;
/**
 * @description document.querySelector shortcut
 * @param s query
 */
export declare const qS: (s: string) => HTMLElement;
/**
 * @description document.querySelectorAll shortcut
 * @param s query
 */
export declare const qSA: (s: string) => NodeListOf<Element>;
/**
 * @description document.getElementById shortcut
 * @param s #id
 */
export declare const gEId: (id: string) => HTMLElement | null;
export declare const basePath: () => string | null;
/**
 * @description creates a NxN matrix
 * @param rows amount of rows
 * @param cols amount of columns
 * @param filler cell filler
 */
export declare const matrix: <T>(rows: number, cols: number, filler: T) => T[][];
/**
 * @description converts a web css property to camel case
 * @param str font-size  -webkit-box-shadow
 * @@returns fontSize  WebkitBoxShadow
 */
export declare const camel: (str: string) => string;
/**
 * @description removes camel of a web css property
 * @param str fontSize  WebkitBoxShadow
 * @returns font-size  -webkit-box-shadow
 */
export declare const uncamel: (str: string) => string;
