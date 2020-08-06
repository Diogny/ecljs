import { Type, IItemSolidOptions, IPoint, IECProperties } from './interfaces';
import ItemSolid from './itemSolid';
import Label from './label';
import Circuit from './circuit';
export default class EC extends ItemSolid {
    protected settings: IECProperties;
    get type(): Type;
    get boardLabel(): Label;
    constructor(circuit: Circuit, options: IItemSolidOptions);
    refresh(): EC;
    setNode(node: number, p: IPoint): EC;
    setVisible(value: boolean): EC;
    remove(): void;
    afterDOMinserted(): void;
    propertyDefaults(): IECProperties;
}
