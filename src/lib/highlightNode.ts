import { extend } from "dabbjs/dist/lib/misc";
import { tag, attr } from "dabbjs/dist/lib/dom";
import Point from "dabbjs/dist/lib/point";
import { Type, IHighlighNodeDefaults } from "./interfaces";
import ItemBase from "./itemsBase";

export default class HighlightNode extends ItemBase {

	protected $!: IHighlighNodeDefaults;

	get type(): Type { return Type.HL }
	get radius(): number { return this.$.radius }

	get selectedId(): string { return this.$.selectedId }
	get selectedNode(): number { return this.$.selectedNode }

	constructor(options: { [x: string]: any; }) {
		//override
		options.selectedNode = -1;
		options.selectedId = "";
		//options.id = "highlighNode";
		super(options);
		this.g.setAttribute("svg-comp", "h-node");
		this.$.mainNode = <SVGCircleElement>tag("circle", "", {
			"svg-type": "node",	// "node-x",
			r: this.radius
		});
		this.g.append(this.$.mainNode);
	}

	public setRadius(value: number): HighlightNode {
		this.$.mainNode.setAttribute("r", <any>(this.$.radius = value <= 0 ? 5 : value));
		return this;
	}

	public hide(): HighlightNode {
		this.g.classList.add("hide");
		this.$.mainNode.classList.remove("hide");
		this.g.innerHTML = "";
		this.g.append(this.$.mainNode);
		return this;
	}

	public show(x: number, y: number, id: string, node: number): HighlightNode {
		this.move(x, y);
		attr(<any>this.$.mainNode, {
			cx: this.x,
			cy: this.y,
			//"node-x": <any>node,
			"node": <any>(this.$.selectedNode = node)
		});
		this.$.selectedId = id;
		this.g.classList.remove("hide");
		return this;
	}

	public showConnections(nodes: Point[]): HighlightNode {
		this.$.mainNode.classList.add("hide");
		this.g.classList.remove("hide");
		nodes.forEach(p => {
			let
				circle = <SVGCircleElement>tag("circle", "", {
					cx: p.x,
					cy: p.y,
					r: this.radius,
					class: "node",
				});
			this.g.append(circle)
		})
		return this
	}

	public defaults(): IHighlighNodeDefaults {
		return <IHighlighNodeDefaults>extend(super.defaults(), {
			name: "h-node",
			class: "h-node",
			visible: false,
			radius: 5
		})
	}

}
