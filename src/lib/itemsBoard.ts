import { IPoint } from 'dabbjs/dist/lib/interfaces';
import { isFn, obj } from 'dabbjs/dist/lib/dab';
import { extend } from 'dabbjs/dist/lib/misc';
import { tCl, attr, tag } from 'dabbjs/dist/lib/dom';
import Size from 'dabbjs/dist/lib/size';
import { IItemBoardDefaults, INodeInfo, ComponentPropertyType, IItemBoardPropEvent } from './interfaces';
import Bond from './bonds';
import ItemBase from './itemsBase';
import Container from './container';

//ItemBoard->Wire
export default abstract class ItemBoard extends ItemBase {

  protected $!: IItemBoardDefaults;

  get onProp(): (args: IItemBoardPropEvent) => void { return this.$.onProp }
  get selected(): boolean { return this.$.selected }
  get bonds(): Bond[] | undefined { return this.container.itemBonds(this) }
  get dir(): boolean { return this.$.dir }

  abstract get count(): number;
  abstract get last(): number;
  abstract refresh(): ItemBoard;
  abstract node(node: number, nodeOnly?: boolean): INodeInfo | undefined;
  abstract get size(): Size;

  constructor(public container: Container<ItemBoard>, options: { [x: string]: any; }) {
    super(options);
    if (!container)
      throw new Error(`missing container`);
    //create getter/setters for every property, so type=="size" or "point" don't need to parse always
    //and later save it along the .xml file for custom values

    this.$.props = obj(this.base.props);
    attr(<any>this.g, {
      id: this.id,
      "svg-comp": this.base.type,
    });
    this.g.innerHTML = this.base.data;
    //this still doesn't work to get all overridable properties ¿?
    //properties still cannot access super value
    //(<any>this.$).$elected = dab.propDescriptor(this, "selected");
  }

  public select(value: boolean): ItemBoard {
    if (this.selected != value) {
      //set new value
      this.$.selected = value;
      //add class if selected, otherwise removes it
      tCl(this.g, "selected", this.selected);
      //trigger property changed if applicable
      this.onProp && this.onProp({
        id: `#${this.id}`,
        code: 3					// "selected" code: 3
      });
    }
    return this;
  }

  public valid(node: number): boolean { return node >= 0 && node < this.count; }

  //this returns true for an EC, and any Wire node and that it is not a start|end bonded node
  public highlightable(node: number): boolean { return this.valid(node) }

  public move(x: number, y: number): ItemBoard {
    super.move(x, y);
    //trigger property changed if applicable
    this.onProp && this.onProp({
      id: `#${this.id}`,
      code: 2					// "move" code: 2
    })
    return this.refresh();
  }

  public static nodeArea = 81;

  /**
   * @description detects a point over a node
   * @param p point to check for component node
   * @param _ln 1-based line number, for EC it's discarded
   */
  public over(p: IPoint, _ln?: number): number {
    for (let i = 0, len = this.count; i < len; i++) {
      let
        node = <INodeInfo>this.node(i);
      //radius 5 =>  5^2 = 25
      if ((Math.pow((p.x) - node.x, 2) + Math.pow((p.y) - node.y, 2)) <= ItemBoard.nodeArea)
        return i;
    }
    return -1;
  }

  /**
   * @description refreshes all bonded components to this node
   * @param node 0-base node
   */
  public nodeRefresh(node: number): ItemBoard {
    let
      bond = this.container.nodeBonds(this, node),
      p = this.node(node);
    p && bond && bond.to.forEach((d) => {
      let
        ic = this.container.get(d.id);
      ic && ic.setNode(d.ndx, <IPoint>p)
    });
    return this;
  }

  /**
   * @description sets node new location. Only works for Wire
   * @param _node 0-base node
   * @param _p new location
   */
  public setNode(_node: number, _p: IPoint): ItemBoard { return this }

  public setOnProp(value: (args: IItemBoardPropEvent) => void): ItemBoard {
    isFn(value) && (this.$.onProp = value);
    return this;
  }

  /**
   * @description returns true if there's at least one node highlighted.
   */
  get isHighlighted(): boolean { return this.g.querySelector(`circle[svg-type="node"]`) != null }

  /**
   * @description returns highlighted status of a node, or sets it's status
   * @param node 0-based node
   * @param value undefined: returns Highlighter; true: highlights; false: removes highlight
   * @returns Highlighter for get if exists & set to true; otherwise undefined
   */
  public highlighted(node: number, value?: boolean): boolean | undefined {
    let
      circleNode = getNode(this.g, node);
    if (value === undefined) {
      return circleNode != null
    }
    if (value === false) {
      //remove if exists, otherwise do nothing, it doesn't exists
      circleNode && this.g.removeChild(circleNode);
    }
    else {
      if (!this.highlightable(node) || circleNode)
        return false;
      //value == true, and it doesn't exists, create and return
      //some bug, it's not deleted
      let
        pin = <INodeInfo>this.node(node, true),
        attributes = {
          "svg-type": this.$.hlNode,
          cx: pin.x,
          cy: pin.y,
          r: this.$.hlRadius
        };
      (<any>attributes)[this.$.hlNode] = node;
      circleNode = <SVGCircleElement>tag("circle", "", attributes);
      this.g.appendChild(circleNode);
    }
    return
  }

  /**
   * @description show/hide all node highlighted
   * @param value true shows all nodes highlighted, false removes all highlights
   */
  public highlight(value: boolean): void {
    for (let node = 0, count = this.count; node < count; node++)
      this.highlighted(node, value)
  }

  /**
   * @description removes all highlights except for this node
   * @param node 0-base node
   */
  public highlightThis(node: number): void {
    for (let n = 0, count = this.count; n < count; n++)
      (n != node)
        && this.highlighted(n, false);
  }

  /**
   * @description refreshes the node highlight position, useful for wire node draggings
   * @param node 0-base node
   */
  public refreshHighlight(node: number): boolean {
    let
      circleNode = getNode(this.g, node),
      pin = <INodeInfo>this.node(node, true);
    if (!circleNode)
      return false;
    attr(<any>circleNode, {
      cx: pin.x,
      cy: pin.y,
    })
    return true
  }

  /**
   * removes this board component from then board
   */
  public remove() {
    this.highlight(false);
    super.remove()
  }

  public prop(name: string): ComponentPropertyType {
    return this.$.props[name]
  }

  /**
   * @description returns all custom properties of this component
   */
  get props(): { [x: string]: ComponentPropertyType } { return this.$.props }

  public defaults(): IItemBoardDefaults {
    return <IItemBoardDefaults>extend(super.defaults(), {
      selected: false,
      onProp: void 0,
      dir: false,
      hlNode: "node",
      hlRadius: 5
    })
  }

}

function getNode(g: SVGElement, n: number) {
  return <SVGCircleElement>g.querySelector(`circle[svg-type="node"][node="${n}"]`)
}
