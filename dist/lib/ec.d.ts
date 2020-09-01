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
    /**
     * removes this electronic component form the board
     */
    remove(): void;
    /**
     * this happens when this component was inserted in the board
     */
    onDOM(): void;
    defaults(): IECDefaults;
}
