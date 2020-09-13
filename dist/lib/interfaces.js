"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = exports.Type = void 0;
var dab_1 = require("dabbjs/dist/lib/dab");
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
var Base = /** @class */ (function () {
    /**
     *
     * @param options [key]::value object with default values
     *
     * note:
     *
     * Only keys inside defaults() object will be copied to the internal object
     */
    function Base(options) {
        this.clear(options);
    }
    /**
     *
     * @param options [key]::value options to be copied internally
     */
    Base.prototype.clear = function (options) {
        this.$ = dab_1.copy(this.defaults(), options || {});
    };
    return Base;
}());
exports.Base = Base;
