import { IItemBaseProperties, IItemBaseOptions, ISize, ComponentPropertyType } from './interfaces';
import { obj, aCl, rCl, isStr } from './dab';
import { tag } from './utils';
import Rect from './rect';
import Point from './point';
import Item from './item';
import Comp from './components';

export default abstract class ItemBase extends Item {

	protected __s: IItemBaseProperties;

	get base(): Comp { return this.__s.base }
	get g(): SVGElement { return this.__s.g }

	get ClientRect(): ISize {
		let b = this.g.getBoundingClientRect();
		return obj({
			width: b.width | 0,
			height: b.height | 0
		})
	}

	get box(): any { return (<any>this.g).getBBox() }

	get origin(): Point {
		let
			b = this.box;
		return new Point((b.x + b.width / 2) | 0, (b.y + b.height / 2) | 0);
	}

	public rect(): Rect {
		return new Rect(this.p.x, this.p.y, this.box.width, this.box.height)
	}

	public setVisible(value: boolean): ItemBase {
		super.setVisible(value);
		this.visible ? rCl(this.g, "hide") : aCl(this.g, "hide")
		return this;
	}

	constructor(options: IItemBaseOptions) {
		super(options);
		let
			base = <Comp>Comp.find(this.name);
		if (!base)
			throw `cannot create component`;
		this.__s.props = obj(base.props);
		let
			classArr = isStr(this.class) ? this.class.split(' ') : [];
		!this.__s.visible && (classArr.push("hide"));
		this.__s.g = tag("g", this.__s.id, {
			class: (this.__s.class = classArr.join(' '))
		});
	}

	public remove() {
		this.g.parentNode?.removeChild(this.g);
	}

	public afterDOMinserted() { }

	public prop(propName: string): ComponentPropertyType {
		return this.__s.props[propName]
	}
}