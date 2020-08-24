export default class Unit {
    protected $: {
        unit: string;
        prefix: string;
        exp: number;
        value: number;
    };
    get unit(): string;
    get prefix(): string;
    get exp(): number;
    get exponent(): number;
    get value(): number;
    constructor(n: string | {
        value: number;
        exp?: number;
        unit: string;
    });
    equal(u: Unit): boolean;
    add(u: Unit): Unit | undefined;
    toString: () => string;
    static split: (text: string) => string[];
    static prefixes: string[];
    static exponents: number[];
    static units: string[];
}
