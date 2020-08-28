import { tag } from "dabbjs/dist/lib/utils"
import ItemSolid from "./itemSolid";
import { INodeInfo } from "./interfaces";
import Size from "dabbjs/dist/lib/size";

export const createText = (attr: any, text: string): SVGTextElement => {
	let
		svgText = tag("text", "", attr);
	return svgText.innerHTML = text, <SVGTextElement>svgText
}

export const pinInfo = (that: ItemSolid, node: number): INodeInfo | undefined => {
	let
		pin = <INodeInfo>that.base.meta.nodes.list[node];
	return pin && {
		x: pin.x,
		y: pin.y,
		label: pin.label
	}
}

export const flowNodes = (list: INodeInfo[], size: Size) => {
	let
		w2 = size.width / 2 | 0,
		h2 = size.height / 2 | 0,
		n = 0,
		node = list[n++];
	node.x = w2;
	(node = list[n++]).x = size.width;
	node.y = h2;
	(node = list[n++]).x = w2;
	node.y = size.height;
	list[n].y = h2;
}