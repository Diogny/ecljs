import { attr } from "dabbjs/dist/lib/dom";
import { each, extend } from "dabbjs/dist/lib/misc";
import { Point } from "dabbjs/dist/lib/point";
import { Size } from "dabbjs/dist/lib/size";
import { Rect } from "dabbjs/dist/lib/rect";
import { IItemSolidDefaults, INodeInfo } from "./interfaces";
import { Bond } from "./bonds";
import { ItemBoard } from "./itemsBoard";
import { Container } from "./container";
import { pinInfo } from "./extra";

//ItemBoard->ItemSolid->EC
export abstract class ItemSolid extends ItemBoard {

  protected $!: IItemSolidDefaults;

  get last(): number { return this.base.meta.nodes.list.length - 1 }

  get count(): number { return this.base.meta.nodes.list.length }

  constructor(container: Container<ItemBoard>, options: { [x: string]: any; }) {
    options.rot = Point.validateRotation(options.rot);
    super(container, options)
  }

  get rot(): number { return this.$.rot }

  /**
   * @description sets rotation of this component to this amount 0-360°
   * @param value 0-360° number value
   */
  public rotate(value: number): ItemSolid {
    if (this.$.rot != (value = Point.validateRotation(value))) {
      this.$.rot = value;
      this.onProp && this.onProp({
        id: `#${this.id}`,
        code: 4					// "rotate" code: 4
      });
    }
    return this.refresh();
  }

  public rect(): Rect {
    let
      size = Size.create(this.box),
      p = this.p;
    if (this.rot) {
      //rotate (0,0) (width,0) (width,height) (0,height) and get the boundaries respectivelly to the location (x,y)
      let
        origin = this.origin,
        angle = -this.rot,
        points = [[p.x, p.y], [p.x + size.width, p.y], [p.x, p.y + size.height], [p.x + size.width, p.y + size.height]]
          .map(p => Point.rotateBy(p[0], p[1], origin.x, origin.y, angle)),
        x = Math.min.apply(Math, points.map(a => a.x)),
        y = Math.min.apply(Math, points.map(a => a.y)),
        w = Math.max.apply(Math, points.map(a => a.x)),
        h = Math.max.apply(Math, points.map(a => a.y));
      return new Rect(Math.round(x), Math.round(y), Math.round(w - x), Math.round(h - y))
    }
    return new Rect(p.x, p.y, size.width, size.height)
  }

  public refresh(): ItemSolid {
    let
      attrs: any = {
        transform: `translate(${this.x} ${this.y})`
      },
      center = this.origin;
    if (this.rot) {
      attrs.transform += ` rotate(${this.rot} ${center.x} ${center.y})`
    }
    attr(<any>this.g, attrs);
    //check below
    each(<any>this.bonds, (_b: Bond, key: any) => {
      this.nodeRefresh(key);
    });
    return this
  }

  /**
   * @description returns the node information
   * @param node 0-based pin/node number
   * @param onlyPoint true to get internal rotated point only without transformations
   *
   * this returns (x, y) relative to the EC location
   */
  public node(node: number, nodeOnly?: boolean): INodeInfo | undefined {
    let
      pin = <INodeInfo>pinInfo(this.base.meta.nodes.list, node);
    if (!pin)
      return;
    if (!nodeOnly) {
      if (this.rot) {
        let
          center = this.origin,
          rot = Point.rotateBy(pin.x, pin.y, center.x, center.y, -this.rot);
        pin.x = rot.x;
        pin.y = rot.y
      }
      pin.x += this.x;
      pin.y += this.y;
    }
    return pin
  }

  public defaults(): IItemSolidDefaults {
    return <IItemSolidDefaults>extend(super.defaults(), {
      rot: 0,
    })
  }

}
