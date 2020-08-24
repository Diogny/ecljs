"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dab_1 = require("./dab");
//... in progress ...
//npm https://www.npmjs.com/package/@dabberio/electric-units
var Unit = /** @class */ (function () {
    function Unit(n) {
        var _this = this;
        this.toString = function () {
            return "" + _this.value + _this.prefix + _this.unit;
        };
        var match, unit, ndx;
        if (dab_1.isStr(n)
            && (match = /^(\d+)(y|z|a|f|p|n|μ|m|c|d||da|h|k|M|G|T|P|E|Z|Y)?(A|V|Ω|F|W|H|M)$/g.exec(n)) != null) {
            this.$ = {
                value: parseFloat(match[1]),
                prefix: match[2],
                exp: Unit.exponents[Unit.prefixes.indexOf(match[2])],
                unit: match[3]
            };
        }
        else if (typeof n === "object"
            && (unit = Unit.units.indexOf(n.unit)) != -1
            && (ndx = Unit.exponents.indexOf(n.exp ? n.exp : 0)) != -1) {
            this.$ = {
                value: n.value,
                unit: Unit.units[unit],
                exp: Unit.exponents[ndx],
                prefix: Unit.prefixes[ndx]
            };
        }
        else
            throw "invalid unit";
        if (isNaN(this.value))
            throw "NaN unit value";
    }
    Object.defineProperty(Unit.prototype, "unit", {
        get: function () { return this.$.unit; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Unit.prototype, "prefix", {
        get: function () { return this.$.prefix; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Unit.prototype, "exp", {
        get: function () { return this.$.exp; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Unit.prototype, "exponent", {
        get: function () { return Math.pow(10, this.exp); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Unit.prototype, "value", {
        get: function () { return this.$.value; },
        enumerable: false,
        configurable: true
    });
    Unit.prototype.equal = function (u) { return this.value == u.value && this.unit == u.unit && this.exp == u.exp; };
    Unit.prototype.add = function (u) {
        if (this.unit != u.unit)
            return;
        var exp = 0, diff = this.exp - u.exp, val0 = this.value, val1 = u.value;
        if (diff < 0) {
            exp = u.exp;
            val0 *= Math.pow(10, -diff);
        }
        else if (diff > 0) {
            exp = this.exp;
            val1 *= Math.pow(10, -diff);
        }
        return new Unit({ value: val0 + val1, exp: exp, unit: this.unit });
    };
    //self sufficient dummy
    Unit.split = function (text) { return text.split('|'); };
    //prefixNames = ['yocto', 'zepto', 'atto', 'femto', 'pico', 'nano', 'micro', 'mili', 'centi', 'deci', '',
    //	'deca', 'hecto', 'kilo', 'mega', 'giga', 'tera', 'peta', 'exa', 'zetta', 'yotta'],
    Unit.prefixes = Unit.split('y|z|a|f|p|n|μ|m|c|d||da|h|k|M|G|T|P|E|Z|Y');
    //['y', 'z', 'a', 'f', 'p', 'n', 'μ', 'm', 'c', 'd', '',
    //'da', 'h', 'k', 'M', 'G', 'T', 'P', 'E', 'Z', 'Y'],
    Unit.exponents = [-24, -21, -18, -15, -12, -9, -6, -3, -2, -1, 0, 1, 2, 3, 6, 9, 12, 15, 18, 21, 24];
    //['Ampere', 'Volt', 'Ohm', 'Farad', 'Watt', 'Henry', 'Meter'],
    Unit.units = Unit.split('A|V|Ω|F|W|H|m');
    return Unit;
}());
exports.default = Unit;
