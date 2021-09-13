import { obj } from 'dabbjs/dist/lib/dab';
import { IBaseStoreComponent, ILibrary, IComponent } from './interfaces';

//const tmpl = "{base.comp.name}-{base.count}";
const defaults = (type: string, name: string): IBaseStoreComponent => (<any>{
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

export default class CompStore {
	/**	
	 * library
	 */
	type: string;
	/**
	 * library name: circuit, flowchart
	 */
	name: string;
	version: string;
	store: Map<string, IComponent>;

	constructor(library: ILibrary) {
		this.name = library.name;
		this.type = library.type;
		this.version = library.version
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
			let
				template = options.tmpl;
			if (template) {
				let
					base = this.find(template.name);
				if (!base)
					throw new Error(`no base template`);
				options.data = base.data;
				options.meta = JSON.parse(JSON.stringify(base.meta));
				template.label && (options.meta.label = obj(template.label));
				template.nodeLabels.forEach((lbl, ndx) => {
					options.meta.nodes.list[ndx].label = lbl;
				})
			}
			//new Comp(option)
			if (this.store.has(options.name))
				throw new Error(`duplicated: ${options.name}`)
			else
				this.store.set(options.name, options)
		});
	}

	public has = (name: string) => this.store.has(name);

	/**
	 * @description find a component by name
	 * @param name component name
	 */
	public find = (name: string): IComponent | undefined => {
		let
			comp = this.store.get(name);
		if (!comp) {
			//look by meta.nameTmpl, the hard way; for C, R, F, VR, BZ
			for (let item of this.store.values()) {
				if (item.meta.nameTmpl == name)
					return item
			}
		}
		return obj(comp)
	}

	/**	
	 * returns all registered components, except wire and system components
	 */
	public get keys(): string[] {
		return Array.from(this.store.values())
			.filter(c => !(c.type == "utils" || c.type == "wire"))
			.map(c => c.name)
	}

	public get size(): number { return this.store.size }
}