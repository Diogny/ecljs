import { extend } from 'dabbjs/dist/lib/misc';
import { tCl, tag } from 'dabbjs/dist/lib/dom';
import Point from 'dabbjs/dist/lib/point';
import Rect from 'dabbjs/dist/lib/rect';
import { IItemBaseDefaults, IType, Type, IComponent } from './interfaces';
import Item from './item';

export default abstract class ItemBase extends Item implements IType {

	protected $!: IItemBaseDefaults;

	abstract get type(): Type;

	get base(): IComponent { return this.$.base }
	get g(): SVGElement { return this.$.g }

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
		this.$.g = tag("g", this.$.id, {
			class: this.class + (this.visible ? '' : ' hide')
		});
	}

	/**
	 * removes this base component from the board
	 */
	public remove() {
		this.g.parentNode?.removeChild(this.g);
	}

	/**
	 * @description this's called after component is inserted in the DOM
	 */
	public onDOM() {
		//
	}

	public defaults(): IItemBaseDefaults {
		return <IItemBaseDefaults>extend(super.defaults(), {
			g: void 0,
			base: <any>void 0	//this comes from createItem by default
		})
	}

}
