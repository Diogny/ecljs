"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dab_1 = require("./dab");
const defaultIdTemplate = "{base.comp.name}-{base.count}";
const defaultComponent = (type, name) => ({
    name: name,
    comp: {
        type: type,
        name: name,
        meta: {
            nameTmpl: defaultIdTemplate,
            nodes: []
        },
        properties: {}
    }
});
class Comp {
    constructor(options) {
        let that = this, template = options.tmpl;
        delete options.tmpl;
        this.settings = dab_1.obj(options);
        if (template) {
            let base = Comp.find(template.name);
            this.settings.data = base.data;
            this.settings.meta = JSON.parse(JSON.stringify(base.meta));
            template.label && (this.settings.meta.label = dab_1.obj(template.label));
            template.nodeLabels.forEach((lbl, ndx) => {
                that.settings.meta.nodes.list[ndx].label = lbl;
            });
        }
        !this.settings.meta.nameTmpl && (this.settings.meta.nameTmpl = defaultIdTemplate);
        if (!Comp.store(this.settings.name, this))
            throw `duplicated: ${this.settings.name}`;
    }
    get name() { return this.settings.name; }
    get library() { return this.settings.library; }
    get type() { return this.settings.type; }
    get data() { return this.settings.data; }
    get props() { return this.settings.properties; }
    get meta() { return this.settings.meta; }
    static initializeComponents(list) {
        let set = Comp.baseComps;
        if (set == null) {
            set = new Map();
        }
        list.forEach((c) => {
            set.set(c.name, c.comp);
        });
        return set;
    }
    static get size() { return Comp.baseComps.size; }
}
exports.default = Comp;
Comp.baseComps = Comp.initializeComponents([
    defaultComponent("utils", "label"),
    defaultComponent("utils", "tooltip"),
    defaultComponent("utils", "h-node"),
    defaultComponent("wire", "wire")
]);
Comp.register = (options) => new Comp(options);
Comp.store = (name, comp) => Comp.baseComps.has(name) ?
    false :
    (Comp.baseComps.set(name, comp), true);
Comp.has = (name) => Comp.baseComps.has(name);
Comp.find = (name) => {
    return Comp.baseComps.get(name);
};
