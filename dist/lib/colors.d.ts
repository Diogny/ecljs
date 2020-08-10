export default class Color {
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
}
