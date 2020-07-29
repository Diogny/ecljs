import { obj } from './dab';
const defaultIdTemplate = "{base.comp.name}-{base.count}";
const defaultComponent = (name) => ({
    name: name,
    comp: {
        name: name,
        type: name,
        meta: {
            nameTmpl: defaultIdTemplate,
            nodes: []
        }
    }
});
export default class Comp {
    constructor(options) {
        let that = this, template = options.tmpl;
        delete options.tmpl;
        this.settings = obj(options);
        if (template) {
            let base = Comp.find(template.name);
            this.settings.data = base.data;
            this.settings.meta = JSON.parse(JSON.stringify(base.meta));
            template.label && (this.settings.meta.label = obj(template.label));
            template.nodeLabels.forEach((lbl, ndx) => {
                that.settings.meta.nodes.list[ndx].label = lbl;
            });
        }
        !this.settings.meta.nameTmpl && (this.settings.meta.nameTmpl = defaultIdTemplate);
        if (!Comp.store(this.settings.name, this))
            throw `duplicated: ${this.settings.name}`;
    }
    get name() { return this.settings.name; }
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
}
Comp.baseComps = Comp.initializeComponents([defaultComponent("tooltip"), defaultComponent("wire")]);
Comp.register = (options) => new Comp(options);
Comp.store = (name, comp) => Comp.baseComps.has(name) ?
    false :
    (Comp.baseComps.set(name, comp), true);
Comp.has = (name) => Comp.baseComps.has(name);
Comp.find = (name) => {
    return Comp.baseComps.get(name);
};
