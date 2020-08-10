"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("./dab");
var utils_1 = require("./utils");
var point_1 = tslib_1.__importDefault(require("./point"));
var BoardCircle = /** @class */ (function () {
    function BoardCircle(nodeName) {
        //set initial default values
        this.__s = {
            nodeName: nodeName || "node",
            nodeValue: -1,
            visible: false,
            radius: 5,
            p: point_1.default.origin
        };
        //create SVG DOM Element
        var tagAttrs = this.getObjectSettings();
        //set svg-type and nodeName value for 'node'
        tagAttrs["svg-type"] = this.nodeName;
        tagAttrs[this.nodeName] = this.nodeValue;
        //create SVG
        this.__s.g = utils_1.tag("circle", "", tagAttrs);
    }
    Object.defineProperty(BoardCircle.prototype, "visible", {
        get: function () { return this.__s.visible; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoardCircle.prototype, "p", {
        get: function () { return this.__s.p; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoardCircle.prototype, "nodeName", {
        get: function () { return this.__s.nodeName; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoardCircle.prototype, "nodeValue", {
        get: function () { return this.__s.nodeValue; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoardCircle.prototype, "radius", {
        get: function () { return this.__s.radius; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoardCircle.prototype, "g", {
        get: function () { return this.__s.g; },
        enumerable: false,
        configurable: true
    });
    BoardCircle.prototype.getDomRadius = function () {
        return parseInt(dab_1.attr(this.g, "r"));
    };
    BoardCircle.prototype.move = function (x, y) {
        this.__s.p = new point_1.default(x, y);
        return this;
    };
    BoardCircle.prototype.setRadius = function (value) {
        this.__s.radius = value <= 0 ? 5 : value;
        return this.refresh();
    };
    BoardCircle.prototype.hide = function () {
        this.__s.visible = false;
        this.__s.p = point_1.default.origin;
        this.__s.nodeValue = -1;
        return this.refresh();
    };
    BoardCircle.prototype.show = function (nodeValue) {
        this.__s.visible = true;
        // this.p  moved first
        this.__s.nodeValue = nodeValue;
        return this.refresh();
    };
    BoardCircle.prototype.getObjectSettings = function () {
        var o = {
            cx: this.p.x,
            cy: this.p.y,
            r: this.radius,
            class: this.visible ? "" : "hide"
        };
        o[this.nodeName] = this.nodeValue;
        return o;
    };
    BoardCircle.prototype.refresh = function () {
        return (dab_1.attr(this.g, this.getObjectSettings()), this);
    };
    return BoardCircle;
}());
exports.default = BoardCircle;
