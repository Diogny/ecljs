import { IItemBaseProperties, IItemBaseOptions, ISize, ComponentPropertyType } from './interfaces';
import Rect from './rect';
import Point from './point';
import Item from './item';
import Comp from './components';
export default abstract class ItemBase extends Item {
    protected __s: IItemBaseProperties;
    get base(): Comp;
    get g(): SVGElement;
    get ClientRect(): ISize;
    get box(): any;
    get origin(): Point;
    rect(): Rect;
    setVisible(value: boolean): ItemBase;
    constructor(options: IItemBaseOptions);
    remove(): void;
    afterDOMinserted(): void;
    prop(propName: string): ComponentPropertyType;
}
