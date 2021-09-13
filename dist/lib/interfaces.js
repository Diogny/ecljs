"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = exports.Type = void 0;
const misc_1 = require("dabbjs/dist/lib/misc");
//import { type } from "os";
//***************************************** Types ************************************//
var Type;
(function (Type) {
    /**
     * Undefined/unknown type
     */
    Type[Type["NONE"] = 0] = "NONE";
    /**
     * Electric Circuit Component
     */
    Type[Type["EC"] = 1] = "EC";
    /**
     * Wire, can be directional/arrow
     */
    Type[Type["WIRE"] = 2] = "WIRE";
    /**
     * Component bond
     */
    Type[Type["BOND"] = 3] = "BOND";
    /**
     * Text Label on the board
     */
    Type[Type["LABEL"] = 4] = "LABEL";
    /**
     * HTML window on the board
     */
    Type[Type["WIN"] = 5] = "WIN";
    /**
     * Tooltip text label
     */
    Type[Type["TOOLTIP"] = 6] = "TOOLTIP";
    /**
     * HighLight
     */
    Type[Type["HL"] = 7] = "HL";
    /**
     * Flowchart resizable component
     */
    Type[Type["FL"] = 8] = "FL";
    /**
     * UI Widget
     */
    Type[Type["WIDGET"] = 9] = "WIDGET";
})(Type = exports.Type || (exports.Type = {}));
;
class Base {
    /**
     *
     * @param options [key]::value object with default values
     *
     * note:
     *
     * Only keys inside defaults() object will be copied to the internal object
     */
    constructor(options) {
        this.clear(options);
    }
    /**
     *
     * @param options [key]::value options to be copied internally
     */
    clear(options) {
        this.$ = (0, misc_1.copy)(this.defaults(), options || {});
    }
}
exports.Base = Base;
