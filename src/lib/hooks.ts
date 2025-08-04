import { dP } from "dabbjs/dist/lib/dab";
import { Size } from "dabbjs/dist/lib/size";
import { Point } from "dabbjs/dist/lib/point";
import { Rect } from "dabbjs/dist/lib/rect";
import Unit from "electric-units/dist/units";
import {
  IPropHook,
  IComponentProperty,
  IEqual,
  IPropHookPropType,
  IHookValue
} from "./interfaces";

/**
 * @description creates a property hook
 * @param p a component property
 */
export function PHook(p: IPropHookPropType): IPropHook {
  let
    modified = false,
    prop: { [id: string]: any } = {},
    value: IHookValue = <any>void 0;

  if (typeof p === "string")
    value = p
  else if (typeof p === "number")
    value = p
  else {
    let cast = <IComponentProperty>p;
    switch (cast.valueType) {
      case "number": value = <number>cast.value; break;
      case "string": value = <string>cast.value; break;
      case "point": value = <Point>Point.parse(cast.value); break;
      case "size": value = <Size>Size.parse(cast.value); break;
      case "rect": value = <Rect>Rect.parse(cast.value); break;
      case "unit": value = new Unit(cast.value); break;
      default:
        throw new Error(`unsupported type`)
    }
  }
  dP(prop, "value", {
    get(): number | string | Size | Point | Unit | Rect {
      return value
    },
    set(val: number | string | Size | Point | Unit | Rect) {
      //test for equality
      let
        fn = <IEqual>(<any>value)["equal"];
      if ((fn == undefined) ? value == val : (<any>value)["equal"](val))	//fn.apply(value, val)
        return;
      value = val;
      modified = true
    }
  });
  dP(prop, "modified", { get(): boolean { return modified } });
  Object.freeze(prop);
  return <any>prop
}
