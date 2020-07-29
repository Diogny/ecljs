import { Type } from './types';
import Point from './point';
import { IItemSolidOptions, IPoint, IItemNode, IItemBoardProperties } from './interfaces';
import ItemSolid from './itemSolid';
import Label from './label';
import Circuit from './circuit';
export default class EC extends ItemSolid {
    labelSVG: Label;
    get last(): number;
    get type(): Type;
    get count(): number;
    constructor(circuit: Circuit, options: IItemSolidOptions);
    rotate(value: number): EC;
    move(x: number, y: number): EC;
    refresh(): EC;
    nodeRefresh(node: number): EC;
    getNode(pinNode: number): IItemNode;
    getNodeRealXY(node: number): Point;
    overNode(p: IPoint, ln: number): number;
    findNode(p: Point): number;
    setNode(node: number, p: IPoint): EC;
    valid(node: number): boolean;
    nodeHighlightable(name: number): boolean;
    setVisible(value: boolean): EC;
    remove(): void;
    afterDOMinserted(): void;
    propertyDefaults(): IItemBoardProperties;
}
