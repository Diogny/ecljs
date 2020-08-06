export declare class Color {
    r: number;
    g: number;
    b: number;
    constructor(r: number, g: number, b: number);
    static scale(k: number, v: Color): Color;
    static plus(v1: Color, v2: Color): Color;
    static times(v1: Color, v2: Color): Color;
    static white: Color;
    static grey: Color;
    static black: Color;
    static background: Color;
    static defaultColor: Color;
    static toDrawingColor(c: Color): {
        r: number;
        g: number;
        b: number;
    };
    static List: Colors;
    static getcolor(text: string, defaultColor?: Colors): string;
}
export declare enum Colors {
    white = 0,
    black = 1,
    green = 2,
    red = 3,
    blue = 4,
    yellow = 5,
    orange = 6,
    purple = 7,
    brown = 8,
    aqua = 9,
    bisque = 10,
    navy = 11,
    teal = 12,
    violet = 13
}
