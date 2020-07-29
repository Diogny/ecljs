export default abstract class ajaxp {
    static sGet: string;
    static sPost: string;
    static xobj: object;
    static rt: string;
    static x(): any;
    static query(data: any, ask: boolean): string;
    static update(io: any, obj: any): any;
    static send(url: string, ox: any): Promise<unknown>;
    static get(url: string, ox: any): any;
    static post(url: string, ox: any): any;
}
