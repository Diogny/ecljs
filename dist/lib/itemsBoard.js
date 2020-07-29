import { condClass, obj, attr, extend, isFn } from './dab';
import Bond from './bonds';
import ItemBase from './itemsBase';
import Comp from './components';
import Point from './point';
import { Type } from './types';
//ItemBoard->Wire
export default class ItemBoard extends ItemBase {
    constructor(circuit, options) {
        super(options);
        this.circuit = circuit;
        let base = Comp.find(this.name);
        if (!base || !circuit)
            throw `cannot create component`;
        this.settings.props = obj(base.props);
        attr(this.g, {
            id: this.id,
            "svg-comp": this.base.type,
        });
        //this still doesn't work to get all overridable properties ¿?
        //properties still cannot access super value
        //(<any>this.settings).__selected = dab.propDescriptor(this, "selected");
    }
    get base() { return this.settings.base; }
    get onProp() { return this.settings.onProp; }
    get selected() { return this.settings.selected; }
    get bonds() { return this.settings.bonds; }
    get label() { return this.settings.label; }
    select(value) {
        if (this.selected != value) {
            //set new value
            this.settings.selected = value;
            //add class if selected
            condClass(this.g, "selected", this.selected);
            //trigger property changed if applicable
            this.onProp && this.onProp({
                id: `#${this.id}`,
                value: this.selected,
                prop: "selected",
                where: 1 //signals it was a change inside the object
            });
        }
        return this;
    }
    move(x, y) {
        super.move(x, y);
        //trigger property changed if applicable
        this.onProp && this.onProp({
            id: `#${this.id}`,
            args: {
                x: this.x,
                y: this.y
            },
            method: 'move',
            where: 1 //signals it was a change inside the object
        });
        return this;
    }
    setOnProp(value) {
        isFn(value) && (this.settings.onProp = value);
        return this;
    }
    bond(thisNode, ic, icNode) {
        let entry = this.nodeBonds(thisNode);
        if (!ic
            || (entry && entry.has(ic.id))
            || !ic.valid(icNode))
            return false;
        if (!entry) {
            this.settings.bonds[thisNode] = entry = new Bond(this, ic, icNode, thisNode);
        }
        else if (!entry.add(ic, icNode)) {
            console.log('Oooopsie!');
        }
        this.settings.bondsCount++;
        this.nodeRefresh(thisNode);
        entry = ic.nodeBonds(icNode);
        return (entry && entry.has(this.id)) ? true : ic.bond(icNode, this, thisNode);
    }
    nodeBonds(nodeName) {
        return this.bonds[nodeName];
    }
    unbond(node, id) {
        let bond = this.nodeBonds(node), b = (bond == null) ? null : bond.remove(id);
        if (b != null) {
            if (bond.count == 0) {
                delete this.settings.bonds[node];
                (--this.settings.bondsCount == 0) && (this.settings.bonds = []);
            }
            this.nodeRefresh(node);
            let ic = this.circuit.get(id);
            ic && ic.unbond(b.ndx, this.id);
        }
    }
    unbondNode(node) {
        var _a;
        let bond = this.nodeBonds(node), link = void 0;
        if (!bond)
            return;
        //try later to use bond.to.forEach, it was giving an error with wire node selection, think it's fixed
        for (let i = 0, len = bond.to.length; i < len; i++) {
            link = bond.to[i];
            (_a = this.circuit.get(link.id)) === null || _a === void 0 ? void 0 : _a.unbond(link.ndx, bond.from.id);
        }
        delete this.settings.bonds[node];
        (--this.settings.bondsCount == 0) && (this.settings.bonds = []);
    }
    disconnect() {
        for (let node = 0; node < this.count; node++)
            this.unbondNode(node);
    }
    propertyDefaults() {
        return extend(super.propertyDefaults(), {
            selected: false,
            onProp: void 0,
            bonds: [],
            bondsCount: 0
        });
    }
    static connectedWiresTo(ecList) {
        var _a;
        let wireList = [], ecIdList = ecList.map(ec => ec.id), circuit = (_a = ecList[0]) === null || _a === void 0 ? void 0 : _a.circuit, secondTest = [], oppositeEdge = (node, last) => node == 0 ? last : (node == last ? 0 : node);
        if (circuit) {
            ecList.forEach(ec => {
                ec.bonds.forEach(bond => {
                    bond.to
                        .filter(b => !wireList.find(w => w.id == b.id))
                        .forEach(b => {
                        let wire = circuit.get(b.id), toWireBond = wire.nodeBonds(oppositeEdge(b.ndx, wire.last));
                        if (toWireBond.to[0].type == Type.EC) {
                            ecIdList.includes(toWireBond.to[0].id)
                                && wireList.push(wire);
                        }
                        else {
                            if (wireList.find(w => w.id == toWireBond.to[0].id)) {
                                wireList.push(wire);
                            }
                            else {
                                secondTest.push({
                                    wire: wire,
                                    toId: toWireBond.to[0].id
                                });
                            }
                        }
                    });
                });
            });
            secondTest
                .forEach(b => wireList.find(w => w.id == b.toId) && wireList.push(b.wire));
        }
        return wireList;
    }
    static wireConnections(wire) {
        let wireCollection = [wire], wiresFound = [], points = [], circuit = wire.circuit, findComponents = (bond) => {
            bond.to.forEach(b => {
                let w = circuit.get(b.id);
                if (!w)
                    throw `Invalid bond connections`; //shouldn't happen, but to catch wrong code
                switch (b.type) {
                    case Type.WIRE:
                        if (!wiresFound.some(id => id == b.id)) {
                            wiresFound.push(w.id);
                            wireCollection.push(w);
                            points.push({
                                it: w,
                                p: Point.create(w.getNode(b.ndx)),
                                n: b.ndx
                            });
                        }
                        break;
                    case Type.EC:
                        points.push({
                            it: w,
                            p: w.getNodeRealXY(b.ndx),
                            n: b.ndx
                        });
                        break;
                }
            });
        };
        while (wireCollection.length) {
            let w = wireCollection.shift();
            wiresFound.push(w.id);
            w.bonds.forEach(findComponents);
        }
        return points;
    }
}
