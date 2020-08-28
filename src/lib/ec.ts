import { IPoint } from 'dabbjs/dist/lib/interfaces';
import { attr, extend, aChld } from 'dabbjs/dist/lib/dab';
import { tag } from 'dabbjs/dist/lib/utils';
import Point from 'dabbjs/dist/lib/point';
import { Type, IECDefaults } from './interfaces';
import ItemSolid from './itemSolid';
import Label from './label';
import Circuit from './circuit';

export default class EC extends ItemSolid {

	protected $: IECDefaults;

	get type(): Type { return Type.EC }

	constructor(circuit: Circuit, options: { [x: string]: any; }) {
		super(circuit, options);
		let
			createText = (attr: any, text: string) => {
				let
					svgText = tag("text", "", attr);
				return svgText.innerHTML = text, svgText
			}
		//add node labels for DIP packages
		if (this.base.meta.nodes.createLabels) {
			let
				pins = (this as unknown as EC).count / 2;
			for (let y = 55, x = 7, i = 0, factor = 20; y > 0; y -= 44, x += (factor = -factor))
				for (let col = 0; col < pins; col++, i++, x += factor)
					aChld(this.g, createText({ x: x, y: y }, i + ""));
		}
		//create label if defined
		if (this.base.meta.labelId) {
			this.$.boardLabel = new Label(<any>{
				fontSize: 15,
				x: this.base.meta.labelId.x,
				y: this.base.meta.labelId.y
			});
			this.$.boardLabel.setText(this.id)
		}
		this.refresh();
		//signal component creation
		this.onProp && this.onProp({
			id: `#${this.id}`,
			code: 1					// "create" code = 1
		});
	}

	public refresh(): EC {
		super.refresh();
		if (this.$.boardLabel) {
			let
				pos = Point.plus(this.p, this.$.boardLabel.p),
				center = this.origin,
				attrs = {
					transform: `translate(${pos.x} ${pos.y})`
				};
			this.rot && (
				center = Point.minus(Point.plus(this.p, center), pos),
				attrs.transform += ` rotate(${this.rot} ${center.x} ${center.y})`
			);
			attr(this.$.boardLabel.g, attrs)
		}
		return this;
	}

	public setNode(node: number, p: IPoint): EC {
		//nobody should call this
		return this;
	}

	public setVisible(value: boolean): EC {
		super.setVisible(value);
		this.$.boardLabel && this.$.boardLabel.setVisible(value);
		return this;
	}

	public remove() {
		//delete label if any first
		this.$.boardLabel && this.g.parentNode?.removeChild(this.$.boardLabel.g);
		super.remove();
	}

	public onDOM() {
		this.$.boardLabel && (this.g.insertAdjacentElement("afterend", this.$.boardLabel.g), this.$.boardLabel.setVisible(true))
	}

	public defaults(): IECDefaults {
		return <IECDefaults>extend(super.defaults(), {
			class: "ec",
			boardLabel: void 0
		})
	}
}