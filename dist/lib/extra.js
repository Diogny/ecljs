"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItem = exports.flowNodes = exports.pinInfo = exports.createText = void 0;
const dom_1 = require("dabbjs/dist/lib/dom");
const createText = (attr, text) => {
    let svgText = (0, dom_1.tag)("text", "", attr);
    return svgText.innerHTML = text, svgText;
};
exports.createText = createText;
/**
 * @description return the info of a node
 * @param list pin/node list
 * @param node 0-based node
 */
const pinInfo = (list, node) => {
    let pin = list[node];
    return pin && {
        x: pin.x,
        y: pin.y,
        label: pin.label
    };
};
exports.pinInfo = pinInfo;
/**
 * @description updates node positions for resizable components like: Flowchart
 * @param list pin/node list
 * @param size component size
 */
const flowNodes = (list, size) => {
    let w2 = size.width / 2 | 0, h2 = size.height / 2 | 0, n = 0, node = list[n++];
    node.x = w2;
    (node = list[n++]).x = size.width;
    node.y = h2;
    (node = list[n++]).x = w2;
    node.y = size.height;
    list[n].y = h2;
};
exports.flowNodes = flowNodes;
const getItem = ($, id) => {
    return $.itemMap.get(id) || $.wireMap.get(id);
};
exports.getItem = getItem;
//# sourceMappingURL=extra.js.map