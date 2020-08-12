"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dab_1 = require("./dab");
var Board = /** @class */ (function () {
    function Board(containers) {
        var _this = this;
        this.__s = containers || [];
        var names = this.containers.map(function (c) {
            c.board = _this;
            return c.name;
        });
        if (names.length != dab_1.unique(names).length)
            throw "duplicated container names";
    }
    Object.defineProperty(Board.prototype, "containers", {
        get: function () { return this.__s; },
        enumerable: false,
        configurable: true
    });
    Board.prototype.add = function (container) {
        if (this.containers.some(function (c) { return c.name == container.name; }))
            throw "duplicated container name: " + container.name;
        this.containers.push(container);
        container.board = this;
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
    return Board;
}());
exports.default = Board;
function index(board, name) {
    return board.containers.findIndex(function (c) { return c.name == name; });
}
