"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("./interfaces");
const dab_1 = require("./dab");
class Bond {
    /**
     * @description implements a component bond, it must be created by default as a One-to-One bond
     * @param {object} from from
     * @param {object} to to
     * @param {number} toNode node
     * @param {any} fromPin pin
     */
    constructor(from, fromPin, to, toNode, origin) {
        this.origin = origin;
        this.toString = () => {
            let fn = (o) => `#${o.id} [${o.ndx}]`, toStr = this.to.map((b) => fn(b)).join(', ');
            return `from ${fn(this.from)} to ${toStr}`;
        };
        if (!from || !to)
            throw 'empty bond';
        this.from = this.create(from, fromPin);
        this.to = [];
        this.add(to, toNode);
    }
    get type() { return interfaces_1.Type.BOND; }
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
            this.to.push(b);
            return true;
        }
        return false;
    }
    create(ec, ndx) {
        return dab_1.obj({
            id: ec.id,
            type: ec.type,
            ndx: ndx
        });
    }
    /**
     * @description removes a bond connection from this component item
     * @param {String} id id name of the destination bond
     * @returns {IBondLink} removed bond item or null if none
     */
    remove(id) {
        let ndx = this.to.findIndex((b) => b.id == id), b = (ndx == -1) ? null : this.to[ndx];
        (b != null) && this.to.splice(ndx, 1);
        return b;
    }
}
exports.default = Bond;
Bond.display = (arr) => {
    return (arr == undefined) ? [] : arr === null || arr === void 0 ? void 0 : arr.map((o) => o.toString());
};
