import { tag } from "dabbjs/dist/lib/utils"
import Size from "dabbjs/dist/lib/size";
import { INodeInfo } from "./interfaces";

export const createText = (attr: any, text: string): SVGTextElement => {
	let
		svgText = tag("text", "", attr);
	return svgText.innerHTML = text, <SVGTextElement>svgText
}

/**
 * @description return the info of a node
 * @param list pin/node list
 * @param node 0-based node
 */
export const pinInfo = (list: INodeInfo[], node: number): INodeInfo | undefined => {
	let
		pin = <INodeInfo>list[node];
	return pin && {
		x: pin.x,
		y: pin.y,
		label: pin.label
	}
}

/**
 * @description updates node positions for resizable components like: Flowchart
 * @param list pin/node list
 * @param size component size
 */
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