import { obj } from 'dabbjs/dist/lib/dab';
//const tmpl = "{base.comp.name}-{base.count}";
const defaults = (type, name) => ({
    name: name,
    comp: {
        type: type,
        name: name,
        meta: {
            //nameTmpl: tmpl,
            nodes: []
        },
        props: {}
    }
});
export class CompStore {
    constructor(library) {
        this.has = (name) => this.store.has(name);
        /**
         * @description find a component by name
         * @param name component name
         */
        this.find = (name) => {
            let comp = this.store.get(name);
            if (!comp) {
                //look by meta.nameTmpl, the hard way; for C, R, F, VR, BZ
                for (let item of this.store.values()) {
                    if (item.meta.nameTmpl == name)
                        return item;
                }
            }
            return obj(comp);
        };
        this.name = library.name;
        this.type = library.type;
        this.version = library.version;
        this.store = new Map();
        //register system components
        ([
            defaults("utils", "label"),
            defaults("utils", "tooltip"),
            defaults("utils", "h-node"),
            defaults("wire", "wire")
        ]).forEach(c => this.store.set(c.name, c.comp));
        //register library
        library.list.forEach(options => {
            let template = options.tmpl;
            if (template) {
                let base = this.find(template.name);
                if (!base)
                    throw new Error(`no base template`);
                options.data = base.data;
                options.meta = JSON.parse(JSON.stringify(base.meta));
                template.label && (options.meta.label = obj(template.label));
                template.nodeLabels.forEach((lbl, ndx) => {
                    options.meta.nodes.list[ndx].label = lbl;
                });
            }
            //new Comp(option)
            if (this.store.has(options.name))
                throw new Error(`duplicated: ${options.name}`);
            else
                this.store.set(options.name, options);
        });
    }
    /**
     * returns all registered components, except wire and system components
     */
    get keys() {
        return Array.from(this.store.values())
            .filter(c => !(c.type == "utils" || c.type == "wire"))
            .map(c => c.name);
    }
    get size() { return this.store.size; }
}
