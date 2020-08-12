import { Type, ISize, ITooltipDefaults } from "./interfaces";
import { attr, obj, isStr, pojo, extend } from './dab';
import { tag, map, filter } from './utils';
import Label from './label';

export default class Tooltip extends Label {

	get type(): Type { return Type.TOOLTIP }
	protected __s: ITooltipDefaults;

	get borderRadius(): number { return this.__s.borderRadius }

	/*	DOESN'T WORK
	set visible(value: boolean) {
		//weird way to access an ancestor property  super.visible doesn't work
		super["visible"] = value;
	}
	*/

	get size(): ISize {
		let b = this.__s.svgtext.getBBox();
		return obj({
			width: Math.round(b.width) + 10, //this.gap,
			height: Math.round(b.height) + this.__s.gap
		})
	}

	constructor(options: { [x: string]: any; }) {
		super(options);
		this.g.insertBefore(this.__s.svgrect = <SVGRectElement>tag("rect", "", {
			x: 0,
			y: 0,
			rx: this.borderRadius
		}), this.__s.svgtext);
	}

	public setVisible(value: boolean): Label {
		super.setVisible(value);
		//clear values
		//because Firefox give DOM not loaded on g.getBox() because it's not visible yet
		// so I've to display tooltip in DOM and then continue setting text, move, font-size,...
		this.__s.text = this.__s.svgtext.innerHTML = '';
		return this;
	}

	public setBorderRadius(value: number): Tooltip {
		this.__s.borderRadius = value | 0;
		return this.build()
	}

	protected build(): Tooltip {
		this.__s.gap = Math.round(this.fontSize / 2) + 1;
		attr(this.__s.svgtext, {
			"font-size": this.fontSize,
			x: Math.round(this.__s.gap / 2), //+ 2, // + 1,
			y: this.fontSize //+ 8
		});
		let
			s = this.size;
		attr(this.__s.svgrect, {
			width: s.width,
			height: s.height,
			rx: this.borderRadius
		});
		return this
	}

	public setText(value: string | any[]): Tooltip {
		let
			arr = isStr(value) ?
				(<string>value).split(/\r?\n/) :
				<[]>value,
			txtArray: string[] = [];
		//catch UI error here
		//if (!Array.isArray(arr)) {
		//	console.log("ooooh")
		//}
		this.__s.svgtext.innerHTML = arr.map((value: string | any[], ndx) => {
			let txt: string = '',
				attrs: string = '';
			if (isStr(value)) {
				txt = <string>value;
			} else if (pojo(value)) {
				txt = (<any>value).text;
				attrs = map(
					filter(value, (val: any, key: string) => key != 'text'),
					(v: string, k: string) => `${k}="${v}"`).join('');
			}
			txtArray.push(txt);
			return `<tspan x="5" dy="${ndx}.1em"${attrs}>${txt}</tspan>`
		}).join('');
		//set text
		this.__s.text = txtArray.join('\r\n');
		return this.build()
	}

	public defaults(): ITooltipDefaults {
		return <ITooltipDefaults>extend(super.defaults(), {
			name: "tooltip",
			class: "tooltip",
			borderRadius: 4
		})
	}

}
