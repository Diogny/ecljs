"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("./dab");
var utils_1 = require("./utils");
var point_1 = tslib_1.__importDefault(require("./point"));
var BoardCircle = /** @class */ (function () {
    function BoardCircle(nodeName) {
        //set initial default values
        this.$ = {
            nodeName: nodeName || "node",
            nodeValue: -1,
            visible: false,
            radius: 5,
            p: point_1.default.origin
        };
        //create SVG DOM Element
        var tagAttrs = this.settings();
        //set svg-type and nodeName value for 'node'
        tagAttrs["svg-type"] = this.nodeName;
        tagAttrs[this.nodeName] = this.nodeValue;
        //create SVG
        this.$.g = utils_1.tag("circle", "", tagAttrs);
    }
    Object.defineProperty(BoardCircle.prototype, "visible", {
        get: function () { return this.$.visible; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoardCircle.prototype, "p", {
        get: function () { return this.$.p; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoardCircle.prototype, "nodeName", {
        get: function () { return this.$.nodeName; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoardCircle.prototype, "nodeValue", {
        get: function () { return this.$.nodeValue; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoardCircle.prototype, "radius", {
        get: function () { return this.$.radius; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(BoardCircle.prototype, "g", {
        get: function () { return this.$.g; },
        enumerable: false,
        configurable: true
    });
    BoardCircle.prototype.domRadius = function () {
        return parseInt(dab_1.attr(this.g, "r"));
    };
    BoardCircle.prototype.move = function (x, y) {
        this.$.p = new point_1.default(x, y);
        return this;
    };
    BoardCircle.prototype.setRadius = function (value) {
        this.$.radius = value <= 0 ? 5 : value;
        return this.refresh();
    };
    BoardCircle.prototype.hide = function () {
        this.$.visible = false;
        this.$.p = point_1.default.origin;
        this.$.nodeValue = -1;
        return this.refresh();
    };
    BoardCircle.prototype.show = function (nodeValue) {
        this.$.visible = true;
        // this.p  moved first
        this.$.nodeValue = nodeValue;
        return this.refresh();
    };
    BoardCircle.prototype.settings = function () {
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
        return (dab_1.attr(this.g, this.settings()), this);
    };
    return BoardCircle;
}());
exports.default = BoardCircle;
