import { IConditionalLabel } from "./interfaces";
import Label from "./label";
import { extend } from "dabbjs/dist/lib/misc";

//internal class
export default class ConditionalLabel extends Label {

	protected $!: IConditionalLabel;

	/**
	 * @description liked 0-base node, -1 if not linked
	 */
	get node(): number { return this.$.node }

	set node(value: number) { this.$.node = value }

	constructor(options: { [x: string]: any; }) {
		//fontSize default Label::fontSize = 15
		options.visible = false;
		isNaN(options.node) && (options.node = -1);
		super(options)
	}

	public defaults(): IConditionalLabel {
		return <IConditionalLabel>extend(super.defaults(), {
			node: -1
		})
	}

}
