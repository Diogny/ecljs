import { IItemBaseProperties, IItemBaseOptions, ISize } from './interfaces';
import Item from './item';
import Rect from './rect';
import Point from './point';
export default abstract class ItemBase extends Item {
    protected settings: IItemBaseProperties;
    get g(): SVGElement;
    get ClientRect(): ISize;
    get box(): any;
    get origin(): Point;
    rect(): Rect;
    setVisible(value: boolean): ItemBase;
    constructor(options: IItemBaseOptions);
    remove(): void;
    afterDOMinserted(): void;
}
