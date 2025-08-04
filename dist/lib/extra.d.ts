import { Size } from "dabbjs/dist/lib/size";
import { INodeInfo, ContainerMapType, IContainerDefaults } from "./interfaces";
import { ItemBoard } from "./itemsBoard";
import { Wire } from "./wire";
export declare const createText: (attr: any, text: string) => SVGTextElement;
/**
 * @description return the info of a node
 * @param list pin/node list
 * @param node 0-based node
 */
export declare const pinInfo: (list: INodeInfo[], node: number) => INodeInfo | undefined;
/**
 * @description updates node positions for resizable components like: Flowchart
 * @param list pin/node list
 * @param size component size
 */
export declare const flowNodes: (list: INodeInfo[], size: Size) => void;
export declare const getItem: <T extends ItemBoard>($: IContainerDefaults<T>, id: string) => ContainerMapType<T | Wire> | undefined;
