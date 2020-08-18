"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var dab_1 = require("./dab");
var utils_1 = require("./utils");
var itemsBase_1 = tslib_1.__importDefault(require("./itemsBase"));
var HighlightNode = /** @class */ (function (_super) {
    tslib_1.__extends(HighlightNode, _super);
    function HighlightNode(options) {
        var _this = this;
        //override
        options.selectedNode = -1;
        options.selectedId = "";
        //options.id = "highlighNode";
        _this = _super.call(this, options) || this;
        _this.g.setAttribute("svg-comp", "h-node");
        _this.$.mainNode = utils_1.tag("circle", "", {
            "svg-type": "node",
            r: _this.radius
        });
        _this.g.append(_this.$.mainNode);
        return _this;
    }
    Object.defineProperty(HighlightNode.prototype, "type", {
        get: function () { return interfaces_1.Type.HIGHLIGHT; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HighlightNode.prototype, "radius", {
        get: function () { return this.$.radius; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HighlightNode.prototype, "selectedId", {
        get: function () { return this.$.selectedId; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(HighlightNode.prototype, "selectedNode", {
        get: function () { return this.$.selectedNode; },
        enumerable: false,
        configurable: true
    });
    HighlightNode.prototype.setRadius = function (value) {
        this.$.mainNode.setAttribute("r", (this.$.radius = value <= 0 ? 5 : value));
        return this;
    };
    HighlightNode.prototype.hide = function () {
        this.g.classList.add("hide");
        this.$.mainNode.classList.remove("hide");
        this.g.innerHTML = "";
        this.g.append(this.$.mainNode);
        return this;
    };
    HighlightNode.prototype.show = function (x, y, id, node) {
        this.move(x, y);
        dab_1.attr(this.$.mainNode, {
            cx: this.x,
            cy: this.y,
            //"node-x": <any>node,
            "node": (this.$.selectedNode = node)
        });
        this.$.selectedId = id;
        this.g.classList.remove("hide");
        return this;
    };
    HighlightNode.prototype.showConnections = function (nodes) {
        var _this = this;
        this.$.mainNode.classList.add("hide");
        this.g.classList.remove("hide");
        nodes.forEach(function (p) {
            var circle = utils_1.tag("circle", "", {
                cx: p.x,
                cy: p.y,
                r: _this.radius,
                class: "node",
            });
            _this.g.append(circle);
        });
        return this;
    };
    HighlightNode.prototype.defaults = function () {
        return dab_1.extend(_super.prototype.defaults.call(this), {
            name: "h-node",
            class: "h-node",
            visible: false,
            radius: 5
        });
    };
    return HighlightNode;
}(itemsBase_1.default));
exports.default = HighlightNode;
