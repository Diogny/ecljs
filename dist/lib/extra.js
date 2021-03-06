"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItem = exports.flowNodes = exports.pinInfo = exports.createText = void 0;
var utils_1 = require("dabbjs/dist/lib/utils");
exports.createText = function (attr, text) {
    var svgText = utils_1.tag("text", "", attr);
    return svgText.innerHTML = text, svgText;
};
/**
 * @description return the info of a node
 * @param list pin/node list
 * @param node 0-based node
 */
exports.pinInfo = function (list, node) {
    var pin = list[node];
    return pin && {
        x: pin.x,
        y: pin.y,
        label: pin.label
    };
};
/**
 * @description updates node positions for resizable components like: Flowchart
 * @param list pin/node list
 * @param size component size
 */
exports.flowNodes = function (list, size) {
    var w2 = size.width / 2 | 0, h2 = size.height / 2 | 0, n = 0, node = list[n++];
    node.x = w2;
    (node = list[n++]).x = size.width;
    node.y = h2;
    (node = list[n++]).x = w2;
    node.y = size.height;
    list[n].y = h2;
};
exports.getItem = function ($, id) {
    return $.itemMap.get(id) || $.wireMap.get(id);
};
