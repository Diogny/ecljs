import { IComponentOptions, IBaseStoreComponent, IComponentMetadata } from './interfaces';
import { obj } from './dab';

const tmpl = "{base.comp.name}-{base.count}";
const defaults = (type: string, name: string): IBaseStoreComponent => (<any>{
	name: name,
	comp: {
		type: type,
		name: name,
		meta: {
			nameTmpl: tmpl,
			nodes: []
		},
		properties: {}
	}
});

export default class Comp {

	private static map: Map<string, Comp> =
		Comp.init([
			defaults("utils", "label"),
			defaults("utils", "tooltip"),
			defaults("utils", "h-node"),
			defaults("wire", "wire")
		]);

	protected __s: IComponentOptions;

	get name(): string { return this.__s.name }
	get library(): string { return this.__s.library }
	get type(): string { return this.__s.type }
	get data(): string { return this.__s.data }
	get props(): { [x: string]: any } { return this.__s.properties }
	get meta(): IComponentMetadata { return this.__s.meta }

	constructor(options: IComponentOptions) {
		let
			that = this,
			template = options.tmpl;
		delete options.tmpl;
		this.__s = obj(options);
		if (template) {
			let
				base = <Comp>Comp.find(template.name);
			this.__s.data = base.data;
			this.__s.meta = JSON.parse(JSON.stringify(base.meta));
			template.label && (this.__s.meta.label = obj(template.label));
			template.nodeLabels.forEach((lbl, ndx) => {
				that.__s.meta.nodes.list[ndx].label = lbl;
			})
		}
		!this.__s.meta.nameTmpl && (this.__s.meta.nameTmpl = tmpl);
		if (!Comp.store(this.__s.name, this))
			throw `duplicated: ${this.__s.name}`;
	}

	public static register = (options: IComponentOptions) => new Comp(options);

	private static init(list: IBaseStoreComponent[]): Map<string, Comp> {
		let
			set: Map<string, Comp> = Comp.map;
		if (set == null) {
			set = new Map();
		}
		list.forEach((c) => {
			set.set(c.name, c.comp)
		});
		return set;
	}

	public static store = (name: string, comp: Comp): boolean =>
		Comp.map.has(name) ?
			false :
			(Comp.map.set(name, comp), true);

	public static has = (name: string) => Comp.map.has(name);

	public static find = (name: string): Comp | undefined => {
		return Comp.map.get(name);
	}

	public static get size(): number { return Comp.map.size }

}