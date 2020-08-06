"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var templates_1 = require("./templates");
var rect_1 = tslib_1.__importDefault(require("./rect"));
var point_1 = tslib_1.__importDefault(require("./point"));
var Board = /** @class */ (function (_super) {
    tslib_1.__extends(Board, _super);
    function Board(options) {
        var _this = _super.call(this, options) || this;
        !Board.validZoom(_this.zoom) && (_this.settings.zoom = Board.defaultZoom);
        return _this;
    }
    Object.defineProperty(Board.prototype, "version", {
        get: function () { return this.settings.version; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "name", {
        get: function () { return this.settings.name; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "description", {
        get: function () { return this.settings.description; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "filePath", {
        get: function () { return this.settings.filePath; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "viewBox", {
        get: function () { return this.settings.viewBox; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "containers", {
        get: function () { return this.settings.containers; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "zoom", {
        get: function () { return this.settings.zoom; },
        set: function (value) {
            Board.validZoom(value)
                && (this.zoom != value)
                && (this.settings.zoom = value);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board, "zoomMultipliers", {
        get: function () {
            return Array.from([8, 4, 2, 1, 0.75, 0.5, 0.33, 0.25, 0.166, 0.125]);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board, "zoomFactors", {
        get: function () {
            return Array.from(["1/8X", "1/4X", "1/2X", "1X", "1 1/2X", "2X", "3X", "4X", "6X", "8X"]);
        },
        enumerable: false,
        configurable: true
    });
    Board.validZoom = function (zoom) {
        return !(isNaN(zoom)
            || !Board.zoomMultipliers.some(function (z) { return z == zoom; }));
    };
    Object.defineProperty(Board.prototype, "modified", {
        get: function () { return this.containers.some(function (c) { return c.modified; }); },
        enumerable: false,
        configurable: true
    });
    Board.prototype.add = function (container) {
        this.containers.push(container);
    };
    Board.prototype.center = function () {
        return new point_1.default(Math.round(this.viewBox.x + this.viewBox.width / 2 | 0), Math.round(this.viewBox.y + this.viewBox.height / 2 | 0));
    };
    Board.prototype.getXML = function () {
        return '<?xml version="1.0" encoding="utf-8"?>\n'
            + templates_1.Templates.parse('boardXml', {
                name: this.name,
                version: this.version,
                zoom: this.zoom,
                description: this.description,
                view: this.viewBox,
                data: this.containers.map(function (c) { return c.getXML(); }).join('\r\n')
            }, true);
    };
    Board.prototype.propertyDefaults = function () {
        return {
            version: "1.1.5",
            name: "",
            description: "",
            filePath: "",
            viewBox: rect_1.default.empty(),
            zoom: 1,
            containers: [],
        };
    };
    Board.defaultZoom = 1; // 1X
    return Board;
}(interfaces_1.BaseSettings));
exports.default = Board;
