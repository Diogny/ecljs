import { attr } from "dabbjs/dist/lib/dom";
import Rect from "dabbjs/dist/lib/rect";
import { IFlowCondDefaults } from "./interfaces";
import FlowComp from "./flowComp";
import Flowchart from "./flowchart";
import ConditionalLabel from "./flowCondLabel";

export default class FlowConditional extends FlowComp {

  protected $!: IFlowCondDefaults;

  /**
  * contains the main frame body, where full component size can be calculated
  */
  get body(): SVGElement { return this.$.path }

  /**
   * client rect where text should be safely contained
   */
  get clientRect(): Rect {
    let
      s = this.size,
      r = new Rect(0, 0, s.width | 0, s.height | 0),
      sw = r.width / 4 | 0,
      sh = r.height / 4 | 0;
    return r.grow(-sw - this.$.padding, -sh - this.$.padding)
  }

  /**
   * @description returns then board true label outerHTML if any
   */
  get trueLabel(): string { return this.$.true?.g.outerHTML }

  /**
   * @description returns then board false label outerHTML if any
   */
  get falseLabel(): string { return this.$.false?.g.outerHTML }

  constructor(flowchart: Flowchart, options: { [x: string]: any; }) {
    super(flowchart, options);
    this.$.path = <SVGPathElement>this.g.firstElementChild;
    this.$.true = new ConditionalLabel({ text: 'true', node: options["true"] });
    this.$.false = new ConditionalLabel({ text: 'false', node: options["false"] });
    this.onResize(this.size)
  }

  /**
   * @description this happens after component was inserted in the DOM
   */
  public onDOM() {
    this.$.true && this.g.insertAdjacentElement("beforebegin", this.$.true.g);
    this.$.false && this.g.insertAdjacentElement("beforebegin", this.$.false.g)
  }

  public setVisible(value: boolean): FlowConditional {
    super.setVisible(value);
    this.$.true && this.$.true.setVisible(this.$.true.node == -1 ? false : value);
    this.$.false && this.$.false.setVisible(this.$.false.node == -1 ? false : value);
    return this;
  }

  /**
   * removes this flowchart conditional from the board
   */
  public remove() {
    //delete label if any first
    this.$.true && this.g.parentNode?.removeChild(this.$.true.g);
    this.$.false && this.g.parentNode?.removeChild(this.$.false.g);
    super.remove()
  }

  /**
   * @description link a condition label to a node
   * @param cond true for true label, false for false label
   * @param node 0-base node, or -1 to unlink/hide
   */
  public setLabel(cond: boolean, node: number) {
    let
      label = getLabel(this.$, cond);
    if (label && node >= -1 && node < this.count) {
      label.node = node;
      positionLabel(this, label)
    }
  }

  /**
   * @description returns the node associated with a label
   * @param cond true for true label, false for false label
   * @returns 0-based node, or -1 if it's not linked
   */
  public nodeLabel(cond: boolean): number {
    let
      label = getLabel(this.$, cond);
    return (label == undefined) ? -1 : label.node
  }

  /**
   * @description refreshes flowchart location, size, and updates bonded cmoponents
   */
  public refresh(): FlowConditional {
    let
      w = this.size.width / 2 | 0,
      h = this.size.height / 2 | 0;
    attr(<any>this.$.path, {
      d: `M ${w},0 L ${this.size.width},${h} L ${w},${this.size.height} L 0,${h} Z`
    });
    super.refresh();
    positionLabel(this, this.$.true);
    positionLabel(this, this.$.false);
    return this
  }

}

function getLabel($: IFlowCondDefaults, cond: boolean): ConditionalLabel | undefined {
  return <ConditionalLabel>(<any>$)[String(!!cond)]
}

function positionLabel(fl: FlowConditional, label: ConditionalLabel) {
  if (label.setVisible(label.node != -1).visible) {
    let
      wh = label.g.getBoundingClientRect(),
      w = fl.size.width,
      w2 = w / 2,
      h = fl.size.height,
      h2 = h / 2,
      x = fl.x,
      y = fl.y,
      n = label.node,
      pad = 7;
    (!(n & 1) && (x += w2 + pad, 1)) || (x += (n == 1 ? w + pad : -wh.width - pad));
    ((n & 1) && (y += h2 - pad, 1)) || (y += (n == 0 ? - pad : h + pad));
    label.move(x, y)
  }
}
