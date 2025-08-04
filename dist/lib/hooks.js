import { dP } from "dabbjs/dist/lib/dab";
import { Size } from "dabbjs/dist/lib/size";
import { Point } from "dabbjs/dist/lib/point";
import { Rect } from "dabbjs/dist/lib/rect";
import Unit from "electric-units/dist/units";
/**
 * @description creates a property hook
 * @param p a component property
 */
export function PHook(p) {
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
                value = Point.parse(cast.value);
                break;
            case "size":
                value = Size.parse(cast.value);
                break;
            case "rect":
                value = Rect.parse(cast.value);
                break;
            case "unit":
                value = new Unit(cast.value);
                break;
            default:
                throw new Error(`unsupported type`);
        }
    }
    dP(prop, "value", {
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
    dP(prop, "modified", { get() { return modified; } });
    Object.freeze(prop);
    return prop;
}
