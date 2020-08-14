"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Base = exports.Type = void 0;
var dab_1 = require("./dab");
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
    function Base(options) {
        this.clear(options);
    }
    Base.prototype.clear = function (options) {
        this.$ = dab_1.obj(dab_1.copy(this.defaults(), options || {}));
    };
    return Base;
}());
exports.Base = Base;
