import { IComponentOptions, IBaseStoreComponent, IComponentMetadata } from './interfaces';
import { obj } from './dab';

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

	protected $: IComponentOptions;

	get name(): string { return this.$.name }
	get library(): string { return this.$.library }
	get type(): string { return this.$.type }
	get data(): string { return this.$.data }
	get props(): { [x: string]: any } { return this.$.properties }
	get meta(): IComponentMetadata { return this.$.meta }

	constructor(options: IComponentOptions) {
		let
			that = this,
			template = options.tmpl;
		delete options.tmpl;
		this.$ = obj(options);
		if (template) {
			let
				base = <Comp>Comp.find(template.name);
			this.$.data = base.data;
			this.$.meta = JSON.parse(JSON.stringify(base.meta));
			template.label && (this.$.meta.label = obj(template.label));
			template.nodeLabels.forEach((lbl, ndx) => {
				that.$.meta.nodes.list[ndx].label = lbl;
			})
		}
		//!this.$.meta.nameTmpl && (this.$.meta.nameTmpl = tmpl);
		if (!Comp.store(this.$.name, this))
			throw `duplicated: ${this.$.name}`;
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
		let
			comp = <Comp>Comp.map.get(name);
		if (!comp) {
			//look by meta.nameTmpl, the hard way; for C, R, F, VR, BZ
			for (let item of Comp.map.values()) {
				if (item.meta.nameTmpl == name)
					return item
			}
		}
		return comp
	}

	public static get size(): number { return Comp.map.size }

}