"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var rect_1 = tslib_1.__importDefault(require("./rect"));
var point_1 = tslib_1.__importDefault(require("./point"));
var dab_1 = require("./dab");
var Board = /** @class */ (function (_super) {
    tslib_1.__extends(Board, _super);
    function Board(options) {
        var _this = _super.call(this, options) || this;
        if (options.viewPoint) {
            //panning
            _this.viewBox.x = options.viewPoint.x;
            _this.viewBox.y = options.viewPoint.y;
        }
        var names = _this.containers.map(function (c) {
            c.board = _this;
            return c.name;
        });
        if (names.length != dab_1.unique(names).length)
            throw "duplicated container names";
        return _this;
    }
    Object.defineProperty(Board.prototype, "version", {
        //later find a way to detect a change in any property:  "name" "description"  "zoom"
        get: function () { return this.__s.version; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "name", {
        get: function () { return this.__s.name; },
        set: function (value) {
            this.__s.name = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "description", {
        get: function () { return this.__s.description; },
        set: function (value) {
            this.__s.description = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "filePath", {
        get: function () { return this.__s.filePath; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "viewBox", {
        get: function () { return this.__s.viewBox; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "containers", {
        get: function () { return this.__s.containers; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "zoom", {
        get: function () { return this.__s.zoom; },
        set: function (value) {
            if (this.zoom != value && Board.validZoom(value)) {
                this.__s.zoom = value;
                this.modified = true;
                this.__s.onZoom && this.__s.onZoom(value);
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "modified", {
        get: function () {
            //check for any change in containers
            if (!this.__s.modified && this.containers.some(function (c) { return c.modified; }))
                this.__s.modified = true;
            return this.__s.modified;
        },
        set: function (value) {
            //trying to set to false with containers modified, is overrided by true
            // all containers must have modified == false, to go through this
            if (!value && this.containers.some(function (c) { return c.modified; })) {
                value = true;
            }
            this.__s.modified = value;
            this.__s.onModified && this.__s.onModified(value);
        },
        enumerable: false,
        configurable: true
    });
    Board.prototype.add = function (container) {
        if (this.containers.some(function (c) { return c.name == container.name; }))
            throw "duplicated container name: " + container.name;
        this.containers.push(container);
        container.board = this;
        this.modified = true;
    };
    Board.prototype.center = function () {
        return new point_1.default(Math.round(this.viewBox.x + this.viewBox.width / 2 | 0), Math.round(this.viewBox.y + this.viewBox.height / 2 | 0));
    };
    Board.prototype.get = function (name) {
        return this.containers.find(function (c) { return c.name == name; });
    };
    Board.prototype.libraries = function (library) {
        return this.containers.filter(function (c) { return c.library == library; });
    };
    Board.prototype.destroy = function () {
        this.containers
            .forEach(function (c) { return c.destroy(); });
        this.__s = void 0;
    };
    Board.prototype.defaults = function () {
        return {
            version: "1.1.5",
            name: "",
            description: "",
            filePath: "",
            viewBox: rect_1.default.empty(),
            zoom: 0,
            containers: [],
            modified: false,
            onZoom: void 0,
            onModified: void 0
        };
    };
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
    Board.defaultZoom = 1; // 1X
    return Board;
}(interfaces_1.Base));
exports.default = Board;
