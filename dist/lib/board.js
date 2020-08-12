"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var dab_1 = require("./dab");
var Board = /** @class */ (function (_super) {
    tslib_1.__extends(Board, _super);
    function Board(options) {
        var _this = _super.call(this, options) || this;
        var names = _this.containers.map(function (c) {
            c.board = _this;
            return c.name;
        });
        if (names.length != dab_1.unique(names).length)
            throw "duplicated container names";
        return _this;
    }
    Object.defineProperty(Board.prototype, "containers", {
        get: function () { return this.__s.containers; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Board.prototype, "modified", {
        get: function () { return this.__s.modified; },
        set: function (value) {
            //brings uniformity to all containers
            this.containers
                .forEach(function (c) { return c.setModified(value); });
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
    Board.prototype.delete = function (name) {
        var ndx = index(this, name);
        return (ndx == -1) ? undefined : this.containers.splice(ndx, 1)[0];
    };
    Board.prototype.get = function (name) {
        return this.containers[index(this, name)];
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
            containers: [],
            modified: false,
            onModified: void 0
        };
    };
    return Board;
}(interfaces_1.Base));
exports.default = Board;
function index(board, name) {
    return board.containers.findIndex(function (c) { return c.name == name; });
}
