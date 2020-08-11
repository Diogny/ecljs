"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var dab_1 = require("./dab");
var utils_1 = require("./utils");
var point_1 = tslib_1.__importDefault(require("./point"));
var rect_1 = tslib_1.__importDefault(require("./rect"));
var itemsBoard_1 = tslib_1.__importDefault(require("./itemsBoard"));
var Wire = /** @class */ (function (_super) {
    tslib_1.__extends(Wire, _super);
    function Wire(container, options) {
        var _a;
        var _this = _super.call(this, container, options) || this;
        _this.__s.directional = container.directional;
        _this.__s.polyline = utils_1.tag("polyline", "", {
            "svg-type": "line",
            line: "0",
            points: "",
        });
        _this.g.append(_this.__s.polyline);
        _this.setPoints(options.points);
        _this.onProp && _this.onProp({
            id: "#" + _this.id,
            args: {
                id: _this.id,
                name: _this.name,
                x: _this.x,
                y: _this.y,
                points: _this.__s.points,
                bonds: '[' + ((_a = _this.bonds) === null || _a === void 0 ? void 0 : _a.map(function (b) { return b.link; }).join(', ')) + ']'
            },
            method: 'create',
            where: 1 //signals it was a change inside the object
        });
        return _this;
    }
    Object.defineProperty(Wire.prototype, "type", {
        get: function () { return interfaces_1.Type.WIRE; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wire.prototype, "count", {
        get: function () { return this.__s.points.length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wire.prototype, "last", {
        get: function () { return this.__s.points.length - 1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wire.prototype, "lastLine", {
        get: function () { return this.editMode ? this.__s.lines.length : 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wire.prototype, "isOpen", {
        get: function () { return !this.nodeBonds(0) || !this.nodeBonds(this.last); },
        enumerable: false,
        configurable: true
    });
    Wire.prototype.rect = function () { return rect_1.default.create(this.box); };
    Object.defineProperty(Wire.prototype, "points", {
        get: function () { return Array.from(this.__s.points); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wire.prototype, "editMode", {
        get: function () { return this.__s.edit; },
        set: function (value) {
            var _this = this;
            if (this.editMode == value)
                return;
            if (this.editMode) {
                //	will change to false
                //		.destroy lines
                this.__s.lines = this.__s.lines.filter(function (ln) {
                    _this.g.removeChild(ln);
                    return false;
                });
                //		.recreate polyline
                this.refresh();
                //		.show polyline
                dab_1.rCl(this.__s.polyline, "hide");
            }
            else {
                //	will change to true
                //		.hide polyline
                dab_1.aCl(this.__s.polyline, "hide");
                //		.create lines
                for (var i = 0, a = this.__s.points[0], cnt = this.last; i < cnt; i++) {
                    var b = this.__s.points[i + 1], ln = utils_1.tag("line", "", {
                        "svg-type": "line",
                        line: (i + 1),
                        x1: a.x,
                        y1: a.y,
                        x2: b.x,
                        y2: b.y
                    });
                    this.__s.lines.push(ln);
                    this.g.insertBefore(ln, this.__s.polyline);
                    a = b;
                }
            }
            this.__s.edit = value;
        },
        enumerable: false,
        configurable: true
    });
    Wire.prototype.refresh = function () {
        dab_1.attr(this.__s.polyline, {
            points: this.__s.points.map(function (p) { return p.x + ", " + p.y; }).join(' ')
        });
        return this;
    };
    Wire.prototype.nodeRefresh = function (node) {
        var _this = this;
        if (this.editMode) {
            var ln = void 0, p = this.__s.points[node];
            (ln = this.__s.lines[node - 1]) && dab_1.attr(ln, { x2: p.x, y2: p.y });
            (ln = this.__s.lines[node]) && dab_1.attr(ln, { x1: p.x, y1: p.y });
        }
        else {
            this.refresh();
        }
        if (!(node == 0 || node == this.last)) {
            var bond = this.nodeBonds(node), p_1 = this.__s.points[node];
            bond && bond.to.forEach(function (b) {
                var _a;
                (_a = _this.container.get(b.id)) === null || _a === void 0 ? void 0 : _a.setNode(b.ndx, p_1);
            });
        }
        return this;
    };
    Wire.prototype.translate = function (dx, dy) {
        _super.prototype.translate.call(this, dx, dy);
        //don't translate bonded end points because it should have been|will be moved by bonded EC or Wire
        var savedEditMode = this.editMode;
        this.editMode = false;
        for (var i = 0, p = this.__s.points[i], end = this.last; i <= end; p = this.__s.points[++i]) {
            if ((i > 0 && i < end) || ((i == 0 || i == end) && !this.nodeBonds(i))) {
                this.setNode(i, point_1.default.translateBy(p, dx, dy));
            }
        }
        this.editMode = savedEditMode;
        return this;
    };
    /**
     * @description returns true if a point is valid
     * @comment later see how to change this to validNode, conflict in !ic.valid(node)
     * 		because we don't know if it's a IC or a wire
     * @param {number} node 0-based point index	it can be -1
     * @returns {boolean} true if point is valid
     */
    Wire.prototype.valid = function (node) {
        //(i) => ((i = i | 0) >= 0 && i < points.length);
        //return (node = <any>node | 0) >= -1 && node < this.points.length;	// NOW ACCEPTS  -1
        //	-1  0  ... last  	   -> true
        //	"-1"  "0"  ... "last"  -> true
        //	""  "  "  "1."  "1a"   -> false
        return node >= -1 //String(Number(node)) == node
            && node <= this.last; // NOW ACCEPTS  -1
    };
    Wire.prototype.appendNode = function (p) {
        return !this.editMode && (this.__s.points.push(p), this.refresh(), true);
    };
    Wire.prototype.setNode = function (node, p) {
        this.__s.points[node].x = p.x | 0;
        this.__s.points[node].y = p.y | 0;
        (node == 0) && moveToStart(this);
        return this.nodeRefresh(node);
    };
    Wire.prototype.hghlightable = function (node) {
        //any Wire node and that it is not a start|end bonded node
        return this.valid(node) //&& this.editMode
            && (!(this.nodeBonds(node) && (node == 0 || node == this.last)));
    };
    Wire.prototype.setPoints = function (points) {
        if (!dab_1.isArr(points)
            || points.length < 2)
            throw 'Poliwire min 2 points';
        if (!this.editMode) {
            this.__s.points = points.map(function (p) { return new point_1.default(p.x | 0, p.y | 0); });
            moveToStart(this);
            this.__s.lines = [];
            this.refresh();
        }
        return this;
    };
    Wire.prototype.getNode = function (node, onlyPoint) {
        var p = this.__s.points[node];
        return p && { x: p.x, y: p.y, label: "node::" + node };
    };
    Wire.prototype.overNode = function (p, ln) {
        var inside = function (np) { return (Math.pow(p.x - np.x, 2) + Math.pow(p.y - np.y, 2)) <= Wire.nodeArea; };
        if (ln) {
            //the fast way
            //lines are 1-based
            var p0 = this.__s.points[ln - 1], p1 = this.__s.points[ln];
            return (!p0 || !p1) ? -1 : inside(p0) ? ln - 1 : inside(p1) ? ln : -1;
        }
        else {
            //the long way
            for (var i = 0, np = this.__s.points[i], len = this.__s.points.length; i < len; np = this.__s.points[++i]) {
                //radius 5 =>  5^2 = 25
                if (inside(np))
                    return i;
            }
            return -1;
        }
    };
    Wire.prototype.deleteLine = function (line) {
        //cannot delete first or last line
        if (line <= 1 || line >= this.last)
            return false;
        var savedEditMode = this.editMode;
        this.editMode = false;
        deleteWireNode(this, line);
        deleteWireNode(this, line - 1);
        this.editMode = savedEditMode;
        return true;
    };
    Wire.prototype.deleteNode = function (node) {
        var savedEditMode = this.editMode, p;
        this.editMode = false;
        p = deleteWireNode(this, node);
        this.editMode = savedEditMode;
        return p;
    };
    Wire.prototype.insertNode = function (node, p) {
        //cannot insert node in first or after last position
        if (node <= 0 || node > this.last || isNaN(node))
            return false;
        var savedEditMode = this.editMode;
        this.editMode = false;
        //fix all bonds link indexes from last to this node
        for (var n = this.last; n >= node; n--) {
            this.container.moveBond(this.id, n, n + 1);
        }
        this.__s.points.splice(node, 0, p);
        this.editMode = savedEditMode;
        return true;
    };
    /**
     * @description standarizes a wire node number to 0..points.length
     * @param {number} node 0-based can be -1:last 0..points.length-1
     * @returns {number} -1 for wrong node or standarized node number, where -1 == last, otherwise node
     */
    Wire.prototype.standarizeNode = function (node) {
        if (this.valid(node))
            return node == -1 ? this.last : node;
        return -1;
    };
    Wire.prototype.defaults = function () {
        return dab_1.extend(_super.prototype.defaults.call(this), {
            name: "wire",
            class: "wire",
            edit: false
        });
    };
    Wire.nodeArea = 25;
    return Wire;
}(itemsBoard_1.default));
exports.default = Wire;
function moveToStart(wire) {
    wire.move(wire.__s.points[0].x, wire.__s.points[0].y);
}
function deleteWireNode(wire, node) {
    var last = wire.last;
    //first or last node cannot be deleted, only middle nodes
    if (node <= 0 || node >= last || isNaN(node))
        return;
    wire.unbondNode(node);
    wire.container.moveBond(wire.id, last, last - 1);
    return wire.__s.points.splice(node, 1)[0];
}
