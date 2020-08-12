import { IItemBaseDefaults, ISize } from './interfaces';
import { obj, tCl } from './dab';
import { tag } from './utils';
import Rect from './rect';
import Point from './point';
import Item from './item';
import Comp from './components';

export default abstract class ItemBase extends Item {

	protected __s: IItemBaseDefaults;

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
		return tCl(this.g, "hide", !super.setVisible(value).visible), this
	}

	constructor(options: { [x: string]: any; }) {
		super(options);
		this.__s.g = tag("g", this.__s.id, {});
		this.setVisible(this.visible)
	}

	public remove() {
		this.g.parentNode?.removeChild(this.g);
	}

	public afterDOMinserted() { }

}