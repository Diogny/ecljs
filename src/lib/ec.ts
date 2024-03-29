import { attr, aChld } from 'dabbjs/dist/lib/dom';
import { extend } from "dabbjs/dist/lib/misc";
import Point from 'dabbjs/dist/lib/point';
import { Type, IECDefaults } from './interfaces';
import ItemSolid from './itemSolid';
import Label from './label';
import Circuit from './circuit';
import { createText } from './extra';
import Size from 'dabbjs/dist/lib/size';

export default class EC extends ItemSolid {

  protected $!: IECDefaults;

  get type(): Type { return Type.EC }

  /**
   * @description returns the read-only size of this component
   */
  get size(): Size { return this.$.size.clone() }

  /**
   * @description returns then board label outerHTML if any
   */
  get boardLabel(): string { return this.$.boardLabel?.g.outerHTML }

  constructor(circuit: Circuit, options: { [x: string]: any; }) {
    super(circuit, options);
    this.$.size = options.size || <Size>Size.parse(this.base.meta.size);
    let
      m = this.base.meta;
    //for labels in N555, 7408, Atmega168
    if (m.label) {
      aChld(this.g, createText({
        x: m.label.x,
        y: m.label.y,
        "class": m.label.class
      }, m.label.text))
    }
    //add node labels for DIP packages
    if (m.nodes.createLabels) {
      let
        pins = (this as unknown as EC).count / 2,
        disp = m.nodes.disp || {  // a way to adjust positioning from outside of the library
          x: 0,
          y: 0
        };
      for (let y = 48 + disp.y, x = 7 + disp.x, i = 0, factor = 20; y > 0; y -= 44, x += (factor = -factor))
        for (let col = 0; col < pins; col++, i++, x += factor)
          aChld(this.g, createText({ x: x, y: y }, i + ""));
    }
    //create label if defined
    if (m.labelId) {
      this.$.boardLabel = new Label(<any>{
        //fontSize default Label::fontSize = 15
        x: m.labelId.x,
        y: m.labelId.y,
        text: this.id,
        visible: false
      })
    }
    this.refresh();
    //signal component creation
    this.onProp && this.onProp({
      id: `#${this.id}`,
      code: 1					// "create" code = 1
    });
  }

  public refresh(): EC {
    super.refresh();
    if (this.$.boardLabel) {
      let
        pos = Point.plus(this.p, this.$.boardLabel.p),
        center = this.origin,
        attrs = {
          transform: `translate(${pos.x} ${pos.y})`
        };
      this.rot && (
        center = Point.minus(Point.plus(this.p, center), pos),
        attrs.transform += ` rotate(${this.rot} ${center.x} ${center.y})`
      );
      attr(<any>this.$.boardLabel.g, attrs)
    }
    return this;
  }

  public setVisible(value: boolean): EC {
    super.setVisible(value);
    this.$.boardLabel && this.$.boardLabel.setVisible(value);
    return this;
  }

  /**
   * removes this electronic component form the board
   */
  public remove() {
    //delete label if any first
    this.$.boardLabel && this.g.parentNode?.removeChild(this.$.boardLabel.g);
    super.remove();
  }

  /**
   * this happens when this component was inserted in the board
   */
  public onDOM() {
    this.$.boardLabel && (this.g.insertAdjacentElement("afterend", this.$.boardLabel.g), this.$.boardLabel.setVisible(true))
  }

  public defaults(): IECDefaults {
    return <IECDefaults>extend(super.defaults(), {
      class: "ec",
      boardLabel: void 0,
    })
  }
}
