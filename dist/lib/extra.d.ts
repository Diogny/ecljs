import ItemSolid from "./itemSolid";
import { INodeInfo } from "./interfaces";
import Size from "dabbjs/dist/lib/size";
export declare const createText: (attr: any, text: string) => SVGTextElement;
export declare const pinInfo: (that: ItemSolid, node: number) => INodeInfo | undefined;
export declare const flowNodes: (list: INodeInfo[], size: Size) => void;
