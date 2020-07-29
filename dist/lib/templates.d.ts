declare class Templates {
    private static map;
    static get(key: string): string;
    static set(key: string, value: string): void;
    static get size(): number;
    static register(obj: {
        [key: string]: string;
    }): void;
    /**
     * @description simple template parser
     * @param key template's key name
     * @param obj object to get values from
     */
    static nano(key: string, obj: any): string;
    /**
     * @description full template parser
     * @param key template's key name
     * @param obj object to get values from
     */
    static parse(key: string, obj: any, beautify?: boolean): string;
}
declare const XML: {
    parse: (str: string, type?: SupportedType) => Document;
    stringify: (DOM: Node) => string;
    transform: (xml: any, xsl: any) => string | DocumentFragment;
    minify: (node: any) => string;
    prettify: (node: any) => string;
    toString: (node: any, pretty: boolean, level?: number, singleton?: boolean) => string;
};
export { Templates, XML };
