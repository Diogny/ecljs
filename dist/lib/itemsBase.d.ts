import { IItemBaseDefaults, IType, Type, IComponent } from './interfaces';
import Rect from './rect';
import Point from './point';
import Item from './item';
export default abstract class ItemBase extends Item implements IType {
    protected $: IItemBaseDefaults;
    abstract get type(): Type;
    get base(): IComponent;
    get g(): SVGElement;
    get box(): any;
    get origin(): Point;
    rect(): Rect;
    setVisible(value: boolean): ItemBase;
    constructor(options: {
        [x: string]: any;
    });
    remove(): void;
    /**
     * @description this's called after component is inserted in the DOM
     */
    onDOM(): void;
    defaults(): IItemBaseDefaults;
}
