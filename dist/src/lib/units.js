"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dab_1 = require("./dab");
//... in progress ...
//npm https://www.npmjs.com/package/@dabberio/electric-units
class Unit {
    constructor(n) {
        this.toString = () => {
            return `${this.value}${this.prefix}${this.unit}`;
        };
        if (!dab_1.isStr(n) || !(n = n.trim()))
            throw `number ${n} must be a not empty string`;
        var ndx = n.length - 1, error = () => `invalid number: ${n}`, indexOf = (s, x, u) => s.indexOf(u ? x.toUpperCase() : x);
        //defaults
        this.settings = {
            unit: -1,
            prefix: -1,
            value: NaN
        };
        //extract unit
        //start with full name first
        if ((this.settings.unit = Unit.unitNames.findIndex(u => n.toUpperCase().endsWith(u.toUpperCase()))) >= 0) {
            ndx -= Unit.unitNames[this.settings.unit].length;
            //now try with unit symbols as is, and then uppercased
        }
        else if ((this.settings.unit = indexOf(Unit.unitSymbols, n[ndx], 0)) >= 0 ||
            (this.settings.unit = indexOf(Unit.unitSymbols, n[ndx], 1)) >= 0) {
            ndx--;
        }
        else
            throw error();
        //extract unit prefix
        if ((this.settings.prefix = Unit.prefixSymbols.indexOf(n[ndx])) == -1) {
            this.settings.prefix = 10; // position of symbol and name: '', exponent: 0
            ndx++;
        }
        //last char has to be a number
        if (isNaN(parseInt(n[ndx - 1])))
            throw error();
        //extract number
        this.settings.value = parseFloat(n.substr(0, ndx));
    }
    //get unit name and symbol
    get name() { return Unit.unitNames[this.settings.unit]; }
    get unit() { return Unit.unitSymbols[this.settings.unit]; }
    get prefix() { return Unit.prefixSymbols[this.settings.prefix]; }
    get exponent() { return Math.pow(10, Unit.prefixExponents[this.settings.prefix]); }
    get value() { return this.settings.value; }
}
exports.default = Unit;
//self sufficient dummy
Unit.split = (text) => text.split('|');
//prefixNames = ['yocto', 'zepto', 'atto', 'femto', 'pico', 'nano', 'micro', 'mili', 'centi', 'deci', '',
//	'deca', 'hecto', 'kilo', 'mega', 'giga', 'tera', 'peta', 'exa', 'zetta', 'yotta'],
Unit.prefixSymbols = Unit.split('y|z|a|f|p|n|μ|m|c|d||da|h|k|M|G|T|P|E|Z|Y');
//['y', 'z', 'a', 'f', 'p', 'n', 'μ', 'm', 'c', 'd', '',
//'da', 'h', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
Unit.prefixExponents = [-24, -21, -18, -15, -12, -9, -6, -3, -2, -1, 0, 1, 2, 3, 6, 9, 12, 15, 18, 21, 24];
Unit.unitNames = Unit.split('Ampere|Volt|Ohm|Farad|Watt|Henry|Meter');
//['Ampere', 'Volt', 'Ohm', 'Farad', 'Watt', 'Henry', 'Meter'],
Unit.unitSymbols = Unit.split('A|V|Ω|F|W|H|m');
