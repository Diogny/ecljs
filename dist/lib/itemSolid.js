import ItemBoard from "./itemsBoard";
import Rect from "./rect";
import Size from "./size";
import Point from "./point";
//ItemBoard->ItemSolid->EC
export default class ItemSolid extends ItemBoard {
    constructor(circuit, options) {
        super(circuit, options);
        //I've to set new properties always, because super just copy defaults()
        //later override method propertyDefaults()
        this.settings.rotation = Point.validateRotation(options.rotation);
    }
    get rotation() { return this.settings.rotation; }
    rotate(value) {
        if (this.settings.rotation != (value = Point.validateRotation(value))) {
            //set new value
            this.settings.rotation = value;
            //trigger property changed if applicable
            this.onProp && this.onProp({
                id: `#${this.id}`,
                value: this.rotation,
                prop: "rotate",
                where: 1 //signals it was a change inside the object
            });
        }
        return this;
    }
    rect() {
        let size = Size.create(this.box), p = this.p;
        if (this.rotation) {
            //rotate (0,0) (width,0) (width,height) (0,height) and get the boundaries respectivelly to the location (x,y)
            let origin = this.origin, angle = -this.rotation, points = [[0, 0], [size.width, 0], [0, size.height], [size.width, size.height]]
                .map(p => new Point(p[0], p[1]).rotateBy(origin.x, origin.y, angle)), x = Math.min.apply(Math, points.map(a => a.x)), y = Math.min.apply(Math, points.map(a => a.y)), w = Math.max.apply(Math, points.map(a => a.x)), h = Math.max.apply(Math, points.map(a => a.y));
            return new Rect(Math.round(p.x + x), Math.round(p.y + y), Math.round(w - x), Math.round(h - y));
        }
        return new Rect(p.x, p.y, size.width, size.height);
    }
}
