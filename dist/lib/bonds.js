import { Type } from './types';
import { obj } from './dab';
export default class Bond {
    /**
     * @description implements a component bond, it must be created by default as a One-to-One bond
     * @param {object} _from from
     * @param {object} _to to
     * @param {number} node node
     * @param {any} pin pin
     */
    constructor(from, to, node, pin) {
        this.toString = () => {
            let fn = (o) => `#${o.id} [${o.ndx}]`, toStr = this.to.map((b) => fn(b)).join(', ');
            return `from ${fn(this.from)} to ${toStr}`;
        };
        if (!from || !to)
            throw 'empty bond';
        this.from = this.create(from, pin);
        this.to = [];
        this.add(to, node);
    }
    get type() { return Type.BOND; }
    get count() { return this.to.length; }
    // 0>id-0(1)&id-1(12)
    get link() { return `${this.from.ndx}>` + this.to.map(b => `${b.id}(${b.ndx})`).join('&'); }
    has(id) { return this.to.some((b) => id == b.id); }
    get(id) {
        return this.to.find((b) => id == b.id);
    }
    add(t, ndx) {
        if (t && !this.has(t.id)) {
            let b = this.create(t, ndx);
            if (b.type == Type.EC || b.type == Type.WIRE) {
                this.to.push(b);
                return true;
            }
        }
        return false;
    }
    create(ec, ndx) {
        return obj({
            id: ec.id,
            type: ec.type,
            ndx: ndx
        });
    }
    /**
     * @description removes a bond connection from this component item
     * @param {String} id id name of the destination bond
     * @returns {IBondItem} removed bond item or null if none
     */
    remove(id) {
        let ndx = this.to.findIndex((b) => b.id == id), b = (ndx == -1) ? null : this.to[ndx];
        (b != null) && this.to.splice(ndx, 1);
        return b;
    }
}
Bond.display = (arr) => { return arr.map((o) => o.toString()); };
