import { Type, ISize, ILabelDefaults } from "./interfaces";
import { obj, aChld, attr, extend } from "./dab";
import { tag } from "./utils";
import ItemBase from "./itemsBase";

export default class Label extends ItemBase {

	get type(): Type { return Type.LABEL }

	protected $: ILabelDefaults;
	get text(): string { return this.$.text }

	get size(): ISize {
		let b = this.$.svgtext.getBBox();
		return obj({
			width: Math.round(b.width),
			height: Math.round(b.height)
		})
	}

	get fontSize(): number { return this.$.fontSize }

	constructor(options: { [x: string]: any; }) {
		options.visible = false;
		super(options);
		this.$.text = '';
		this.$.svgtext = <SVGTextElement>tag("text", "", {});
		aChld(this.g, this.$.svgtext);
	}

	public move(x: number, y: number): Label {
		super.move(x, y);
		attr(this.g, { transform: "translate(" + this.x + " " + this.y + ")" });
		return this;
	}

	public setFontSize(value: number): Label {
		this.$.fontSize = value;
		return this.build()
	}

	protected build(): Label {
		attr(this.$.svgtext, {
			"font-size": this.fontSize,
			x: 0,
			y: 0
		});
		return this;
	}

	public setText(value: string): Label {
		this.$.svgtext.innerHTML = this.$.text = value;
		return this.build()
	}

	public defaults(): ILabelDefaults {
		return <ILabelDefaults>extend(super.defaults(), {
			name: "label",
			class: "label",
			fontSize: 50
		})
	}

}