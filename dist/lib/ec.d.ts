import { Type, IECDefaults } from './interfaces';
import ItemSolid from './itemSolid';
import Circuit from './circuit';
export default class EC extends ItemSolid {
    protected $: IECDefaults;
    get type(): Type;
    constructor(circuit: Circuit, options: {
        [x: string]: any;
    });
    refresh(): EC;
    setVisible(value: boolean): EC;
    remove(): void;
    onDOM(): void;
    defaults(): IECDefaults;
}
