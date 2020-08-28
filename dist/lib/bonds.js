"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dab_1 = require("dabbjs/dist/lib/dab");
var interfaces_1 = require("./interfaces");
var Bond = /** @class */ (function () {
    /**
     * @description implements a component bond, it must be created by default as a One-to-One bond
     * @param from component
     * @param fromPin component's pin/node
     * @param to component
     * @param toNode component's pini/node
     * @param dir direction of the bond: 0=origin, A to B; or 1=dest, B to A
     */
    function Bond(from, fromPin, to, toNode, dir) {
        var _this = this;
        this.dir = dir;
        this.toString = function () {
            var fn = function (o) { return "#" + o.id + " [" + o.ndx + "]"; }, toStr = _this.to.map(function (b) { return fn(b); }).join(', ');
            return "from " + fn(_this.from) + " to " + toStr;
        };
        if (!from || !to)
            throw 'empty bond';
        this.from = this.create(from, fromPin);
        this.to = [];
        this.add(to, toNode);
    }
    Object.defineProperty(Bond.prototype, "type", {
        get: function () { return interfaces_1.Type.BOND; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Bond.prototype, "count", {
        get: function () { return this.to.length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Bond.prototype, "link", {
        // 0>id-0(1)&id-1(12)
        get: function () { return this.from.ndx + ">" + this.to.map(function (b) { return b.id + "(" + b.ndx + ")"; }).join('&'); },
        enumerable: false,
        configurable: true
    });
    Bond.prototype.has = function (id) { return this.to.some(function (b) { return id == b.id; }); };
    Bond.prototype.get = function (id) {
        return this.to.find(function (b) { return id == b.id; });
    };
    Bond.prototype.add = function (t, ndx) {
        if (t && !this.has(t.id)) {
            var b = this.create(t, ndx);
            this.to.push(b);
            return true;
        }
        return false;
    };
    Bond.prototype.create = function (ec, ndx) {
        return dab_1.obj({
            id: ec.id,
            type: ec.type,
            ndx: ndx
        });
    };
    /**
     * @description removes a bond connection from this component item
     * @param {String} id id name of the destination bond
     * @returns {IBondNode} removed bond item or null if none
     */
    Bond.prototype.remove = function (id) {
        var ndx = this.to.findIndex(function (b) { return b.id == id; }), b = (ndx == -1) ? null : this.to[ndx];
        (b != null) && this.to.splice(ndx, 1);
        return b;
    };
    Bond.display = function (arr) {
        return (arr == undefined) ? [] : arr === null || arr === void 0 ? void 0 : arr.filter(function (b) { return b != undefined; }).map(function (o) { return o.toString(); });
    };
    return Bond;
}());
exports.default = Bond;
