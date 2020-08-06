export default class Unit {
    protected settings: {
        unit: number;
        prefix: number;
        value: number;
    };
    get name(): string;
    get unit(): string;
    get prefix(): string;
    get exponent(): number;
    get value(): number;
    constructor(n: string);
    toString: () => string;
    static split: (text: string) => string[];
    static prefixSymbols: string[];
    static prefixExponents: number[];
    static unitNames: string[];
    static unitSymbols: string[];
}
