"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PHook = void 0;
const tslib_1 = require("tslib");
const dab_1 = require("dabbjs/dist/lib/dab");
const size_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/size"));
const point_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/point"));
const rect_1 = (0, tslib_1.__importDefault)(require("dabbjs/dist/lib/rect"));
const units_1 = (0, tslib_1.__importDefault)(require("electric-units/dist/units"));
/**
 * @description creates a property hook
 * @param p a component property
 */
function PHook(p) {
    let modified = false, prop = {}, value = void 0;
    if (typeof p === "string")
        value = p;
    else if (typeof p === "number")
        value = p;
    else {
        let cast = p;
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
                throw new Error(`unsupported type`);
        }
    }
    (0, dab_1.dP)(prop, "value", {
        get() {
            return value;
        },
        set(val) {
            //test for equality
            let fn = value["equal"];
            if ((fn == undefined) ? value == val : value["equal"](val)) //fn.apply(value, val)
                return;
            value = val;
            modified = true;
        }
    });
    (0, dab_1.dP)(prop, "modified", { get() { return modified; } });
    Object.freeze(prop);
    return prop;
}
exports.PHook = PHook;
