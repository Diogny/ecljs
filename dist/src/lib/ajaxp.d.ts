export default abstract class ajaxp {
    static sGet: string;
    static sPost: string;
    static xobj: object;
    static rt: string;
    static x(): any;
    static query(data: {
        [key: string]: any;
    }, ask: boolean): string;
    static update(io: any, obj: {
        [key: string]: any;
    }): {
        [key: string]: any;
    };
    static send(url: string, ox: {
        [key: string]: any;
    }): Promise<any>;
    static get(url: string, ox: {
        [key: string]: any;
    }): Promise<any>;
    static post(url: string, ox: {
        [key: string]: any;
    }): Promise<any>;
}
