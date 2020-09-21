import { Type, IECDefaults } from './interfaces';
import ItemSolid from './itemSolid';
import Circuit from './circuit';
import Size from 'dabbjs/dist/lib/size';
export default class EC extends ItemSolid {
    protected $: IECDefaults;
    get type(): Type;
    /**
     * @description returns the read-only size of this component
     */
    get size(): Size;
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
