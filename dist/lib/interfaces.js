"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = exports.Type = void 0;
var dab_1 = require("dabbjs/dist/lib/dab");
//***************************************** Types ************************************//
var Type;
(function (Type) {
    Type[Type["UNDEFINED"] = 0] = "UNDEFINED";
    Type[Type["EC"] = 1] = "EC";
    Type[Type["WIRE"] = 2] = "WIRE";
    Type[Type["BOND"] = 3] = "BOND";
    Type[Type["LABEL"] = 4] = "LABEL";
    Type[Type["WIN"] = 5] = "WIN";
    Type[Type["TOOLTIP"] = 6] = "TOOLTIP";
    Type[Type["HIGHLIGHT"] = 7] = "HIGHLIGHT";
    Type[Type["FLOWCHART"] = 8] = "FLOWCHART";
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
        this.$ = dab_1.obj(dab_1.copy(this.defaults(), options || {}));
    };
    return Base;
}());
exports.Base = Base;
