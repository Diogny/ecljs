import { Type, IPoint, IECDefaults } from './interfaces';
import ItemSolid from './itemSolid';
import Label from './label';
import Circuit from './circuit';
export default class EC extends ItemSolid {
    protected $: IECDefaults;
    get type(): Type;
    get boardLabel(): Label;
    constructor(circuit: Circuit, options: {
        [x: string]: any;
    });
    refresh(): EC;
    setNode(node: number, p: IPoint): EC;
    setVisible(value: boolean): EC;
    remove(): void;
    afterDOMinserted(): void;
    defaults(): IECDefaults;
}
