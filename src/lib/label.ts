import { ISize } from "dabbjs/dist/lib/interfaces";
import { obj, aChld, attr, extend } from "dabbjs/dist/lib/dab";
import { tag } from "dabbjs/dist/lib/utils";
import { Type, ILabelDefaults } from "./interfaces";
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
		super(options);
		aChld(this.g, this.$.svgtext = <SVGTextElement>tag("text", "", {}));
		this.setText(this.$.text)
	}

	public move(x: number, y: number): Label {
		super.move(x, y);
		attr(this.g, { transform: "translate(" + this.x + " " + this.y + ")" });
		return this;
	}

	public setFontSize(value: number): Label {
		attr(this.$.svgtext, {
			"font-size": this.$.fontSize = value
		});
		return this
	}

	public setText(text: string): Label {
		return this.$.svgtext.innerHTML = this.$.text = text, this
	}

	public defaults(): ILabelDefaults {
		return <ILabelDefaults>extend(super.defaults(), {
			name: "label",
			class: "label",
			fontSize: 15,
			text: ""
		})
	}

}