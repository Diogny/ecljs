import { IItemBaseDefaults, ISize } from './interfaces';
import Rect from './rect';
import Point from './point';
import Item from './item';
import Comp from './components';
export default abstract class ItemBase extends Item {
    protected __s: IItemBaseDefaults;
    get base(): Comp;
    get g(): SVGElement;
    get ClientRect(): ISize;
    get box(): any;
    get origin(): Point;
    rect(): Rect;
    setVisible(value: boolean): ItemBase;
    constructor(options: {
        [x: string]: any;
    });
    remove(): void;
    afterDOMinserted(): void;
}
