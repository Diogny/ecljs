import { isStr } from "./dab";

//... in progress ...
//npm https://www.npmjs.com/package/@dabberio/electric-units
export default class Unit {

	protected $: { unit: string, prefix: string, exp: number, value: number };

	get unit(): string { return this.$.unit }
	get prefix(): string { return this.$.prefix }
	get exp(): number { return this.$.exp }
	get exponent(): number { return Math.pow(10, this.exp) }
	get value(): number { return this.$.value; }

	constructor(n: string | { value: number, exp?: number, unit: string }) {
		let
			match: RegExpExecArray,
			unit: number,
			ndx: number;
		if (isStr(n)
			&& (match = <RegExpExecArray>/^(\d+)(y|z|a|f|p|n|μ|m|c|d||da|h|k|M|G|T|P|E|Z|Y)?(A|V|Ω|F|W|H|M)$/g.exec(<string>n)) != null) {
			this.$ = {
				value: parseFloat(match[1]),
				prefix: match[2],											//could be undefined
				exp: Unit.exponents[Unit.prefixes.indexOf(match[2])],		//could be -1 if not defined
				unit: match[3]
			}
		} else if (typeof n === "object"
			&& (unit = Unit.units.indexOf(n.unit)) != -1
			&& (ndx = Unit.exponents.indexOf(n.exp ? n.exp : 0)) != -1) {
			this.$ = {
				value: n.value,
				unit: Unit.units[unit],
				exp: Unit.exponents[ndx],
				prefix: Unit.prefixes[ndx]
			}
		} else
			throw `invalid unit`;
		if (isNaN(this.value))
			throw `NaN unit value`
	}

	public add(u: Unit): Unit | undefined {
		if (this.unit != u.unit)
			return
		let
			exp = 0,
			diff = this.exp - u.exp,
			val0 = this.value,
			val1 = u.value;
		if (diff < 0) {
			exp = u.exp;
			val0 *= Math.pow(10, -diff)
		}
		else if (diff > 0) {
			exp = this.exp;
			val1 *= Math.pow(10, -diff)
		}
		return new Unit({ value: val0 + val1, exp: exp, unit: this.unit })
	}

	public toString = (): string => {
		return `${this.value}${this.prefix}${this.unit}`;
	}

	//self sufficient dummy
	static split = (text: string): string[] => text.split('|');
	//prefixNames = ['yocto', 'zepto', 'atto', 'femto', 'pico', 'nano', 'micro', 'mili', 'centi', 'deci', '',
	//	'deca', 'hecto', 'kilo', 'mega', 'giga', 'tera', 'peta', 'exa', 'zetta', 'yotta'],
	static prefixes = Unit.split('y|z|a|f|p|n|μ|m|c|d||da|h|k|M|G|T|P|E|Z|Y');
	//['y', 'z', 'a', 'f', 'p', 'n', 'μ', 'm', 'c', 'd', '',
	//'da', 'h', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
	static exponents = [-24, -21, -18, -15, -12, -9, -6, -3, -2, -1, 0, 1, 2, 3, 6, 9, 12, 15, 18, 21, 24];
	//['Ampere', 'Volt', 'Ohm', 'Farad', 'Watt', 'Henry', 'Meter'],
	static units: string[] = Unit.split('A|V|Ω|F|W|H|m');
}