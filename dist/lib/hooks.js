"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHook = void 0;
var tslib_1 = require("tslib");
var dab_1 = require("dabbjs/dist/lib/dab");
var size_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/size"));
var point_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/point"));
var rect_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/rect"));
var units_1 = tslib_1.__importDefault(require("electric-units/dist/units"));
/**
 * @description creates a property hook
 * @param p a component property
 */
function PHook(p) {
    var modified = false, prop = {}, value = void 0;
    if (typeof p === "string")
        value = p;
    else if (typeof p === "number")
        value = p;
    else {
        var cast = p;
        switch (cast.valueType) {
            case "number":
                value = cast.value;
                break;
            case "string":
                value = cast.value;
                break;
            case "point":
                value = point_1.default.parse(cast.value);
                break;
            case "size":
                value = size_1.default.parse(cast.value);
                break;
            case "rect":
                value = rect_1.default.parse(cast.value);
                break;
            case "unit":
                value = new units_1.default(cast.value);
                break;
            default:
                throw "unsupported type";
        }
    }
    dab_1.dP(prop, "value", {
        get: function () {
            return value;
        },
        set: function (val) {
            //test for equality
            var fn = value["equal"];
            if ((fn == undefined) ? value == val : value["equal"](val)) //fn.apply(value, val)
                return;
            value = val;
            modified = true;
        }
    });
    dab_1.dP(prop, "modified", { get: function () { return modified; } });
    Object.freeze(prop);
    return prop;
}
exports.PHook = PHook;
