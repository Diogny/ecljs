"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("dabbjs/dist/lib/dab");
var utils_1 = require("dabbjs/dist/lib/utils");
var point_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/point"));
var rect_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/rect"));
var interfaces_1 = require("./interfaces");
var itemsBoard_1 = tslib_1.__importDefault(require("./itemsBoard"));
var size_1 = tslib_1.__importDefault(require("dabbjs/dist/lib/size"));
var Wire = /** @class */ (function (_super) {
    tslib_1.__extends(Wire, _super);
    function Wire(container, options) {
        var _this = _super.call(this, container, options) || this;
        _this.$.dir = container.dir;
        _this.setPoints(options.points);
        _this.onProp && _this.onProp({
            id: "#" + _this.id,
            code: 1 // "create" code = 1
        });
        return _this;
    }
    Object.defineProperty(Wire.prototype, "type", {
        get: function () { return interfaces_1.Type.WIRE; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wire.prototype, "count", {
        get: function () { return this.$.points.length; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wire.prototype, "last", {
        get: function () { return this.$.points.length - 1; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wire.prototype, "lastLine", {
        get: function () { return this.edit ? this.$.lines.length : 0; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wire.prototype, "isOpen", {
        get: function () { return !this.container.nodeBonds(this, 0) || !this.container.nodeBonds(this, this.last); },
        enumerable: false,
        configurable: true
    });
    Wire.prototype.rect = function () { return rect_1.default.create(this.box); };
    Object.defineProperty(Wire.prototype, "points", {
        get: function () { return Array.from(this.$.points); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wire.prototype, "edit", {
        get: function () { return this.$.edit; },
        /**
         * @description get/set wire edit mode
         */
        set: function (value) {
            if (this.edit == value)
                return;
            this.g.innerHTML = "";
            this.$.dir && (this.$.arrow = poly(this.g, "arrow", -1));
            if (this.edit) {
                //	will change to false
                //		.destroy lines
                this.$.lines = [];
                //		.recreate polyline
                this.$.poly = poly(this.g);
            }
            else {
                //	will change to true
                //		.destroy polyline
                this.$.poly = void 0;
                //		.recreate lines
                setlines(this, this.$);
            }
            //has to be at the end, because logic
            this.$.edit = value;
            //refresh only with polyline
            !value && this.refresh();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wire.prototype, "head", {
        get: function () { return this.$.headLength; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wire.prototype, "swipe", {
        get: function () { return this.$.headAngle; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Wire.prototype, "size", {
        /**
         * @description returns wire size, it's computed every time, so save locally if called multiple times
         */
        get: function () {
            var minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
            this.$.points.forEach(function (p) {
                minX = Math.min(minX, p.x);
                maxX = Math.max(maxX, p.x);
                minY = Math.min(minY, p.y);
                maxY = Math.max(maxY, p.y);
            });
            return new size_1.default(maxX - minX + 1, maxY - minY + 1);
        },
        enumerable: false,
        configurable: true
    });
    /**
     * @description customize arrow for directional wires only
     * @param length arrow line length
     * @param angle arrow lines swipe angle
     */
    Wire.prototype.arrow = function (length, angle) {
        if (!this.$.dir)
            return;
        this.$.headLength = length;
        this.$.headAngle = angle;
        arrow(this.$);
    };
    Wire.prototype.refresh = function () {
        if (this.edit) {
            for (var i = 0, a = this.$.points[0], last = this.last; i < last; i++) {
                var b = this.$.points[i + 1], ln = this.$.lines[i];
                dab_1.attr(ln, {
                    line: i + 1,
                    x1: a.x,
                    y1: a.y,
                    x2: b.x,
                    y2: b.y
                });
                a = b;
            }
        }
        else
            dab_1.attr(this.$.poly, {
                points: this.$.points.map(function (p) { return p.x + ", " + p.y; }).join(' ')
            });
        arrow(this.$); //	full-refresh
        return this;
    };
    Wire.prototype.nodeRefresh = function (node) {
        var _this = this;
        if (this.edit) {
            var ln = void 0, p = this.$.points[node];
            (ln = this.$.lines[node - 1]) && dab_1.attr(ln, { x2: p.x, y2: p.y });
            (ln = this.$.lines[node]) && dab_1.attr(ln, { x1: p.x, y1: p.y });
            arrow(this.$, node); // partial-refresh
        }
        else {
            this.refresh();
        }
        if (!(node == 0 || node == this.last)) {
            var bond = this.container.nodeBonds(this, node), p_1 = this.$.points[node];
            bond && bond.to.forEach(function (b) {
                var _a;
                (_a = _this.container.get(b.id)) === null || _a === void 0 ? void 0 : _a.setNode(b.ndx, p_1);
            });
        }
        return this;
    };
    Wire.prototype.setNode = function (node, p) {
        this.$.points[node].x = p.x | 0;
        this.$.points[node].y = p.y | 0;
        (node == 0) && moveToStart(this.$);
        this.refreshHighlight(node);
        return this.nodeRefresh(node);
    };
    Wire.prototype.translate = function (dx, dy) {
        _super.prototype.translate.call(this, dx, dy);
        //don't translate bonded end points because it should have been|will be moved by bonded EC or Wire
        var savededit = this.edit;
        this.edit = false;
        for (var i = 0, p = this.$.points[i], end = this.last; i <= end; p = this.$.points[++i]) {
            //avoid circular reference, bonded start/end nodes are refresed by EC's nodes
            if ((i > 0 && i < end) || ((i == 0 || i == end) && !this.container.nodeBonds(this, i))) {
                this.setNode(i, point_1.default.translateBy(p, dx, dy));
            }
        }
        this.edit = savededit;
        arrow(this.$); // full-refresh
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
        return node >= 0 //-1   //String(Number(node)) == node
            && node <= this.last; // NOW ACCEPTS  -1
    };
    /**
     * @description appends a new node at the end, only works in edit mode, creating a wire
     * @param p new point
     */
    Wire.prototype.append = function (p) {
        //only works in edit mode = false, so far
        return !this.edit && (this.$.points.push(p), this.refresh(), true);
    };
    Wire.prototype.highlightable = function (node) {
        //any Wire node and that it is not a start|end bonded node
        return !((node == 0 || node == this.last) && this.container.nodeBonds(this, node));
    };
    Wire.prototype.setPoints = function (points) {
        if (!dab_1.isArr(points)
            || points.length < 2)
            throw 'wire min 2 points';
        //cleanup
        this.g.innerHTML = "";
        this.$.points = points.map(function (p) { return new point_1.default(p.x | 0, p.y | 0); });
        this.$.dir && (this.$.arrow = poly(this.g, "arrow", -1));
        moveToStart(this.$);
        if (this.edit) {
            this.$.poly = void 0;
            setlines(this, this.$);
        }
        else {
            this.$.lines = [];
            this.$.poly = poly(this.g);
            this.refresh();
        }
        return this;
    };
    /**
     * @description returns the node information
     * @param node 0-based pin/node number
     * @param onlyPoint it's discarded
     *
     * this returns absolute (x, y) position
     */
    Wire.prototype.node = function (node, onlyPoint) {
        var p = this.$.points[node];
        return p && { x: p.x, y: p.y, label: "node::" + node };
    };
    /**
     * @description detects a point over a node
     * @param p point to check for component node
     * @param ln 1-based line number, ln undefined or 0, checks the whole wire, otherwise just check this line
     */
    Wire.prototype.over = function (p, ln) {
        var inside = function (np) { return (Math.pow(p.x - np.x, 2) + Math.pow(p.y - np.y, 2)) <= Wire.nodeArea; };
        if (ln) {
            //the fast way
            //lines are 1-based
            var p0 = this.$.points[ln - 1], p1 = this.$.points[ln];
            return (!p0 || !p1) ? -1 : inside(p0) ? ln - 1 : inside(p1) ? ln : -1;
        }
        else {
            //the long way
            for (var i = 0, np = this.$.points[i], len = this.$.points.length; i < len; np = this.$.points[++i]) {
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
        deleteWireNode(this, this.$, line);
        deleteWireNode(this, this.$, line - 1);
        this.refresh();
        this.highlight(false);
        return true;
    };
    Wire.prototype.deleteNode = function (node) {
        var p = deleteWireNode(this, this.$, node);
        this.refresh();
        this.highlight(false);
        return p;
    };
    Wire.prototype.insertNode = function (node, p) {
        //cannot insert node in first or after last position
        if (node <= 0 || node > this.last || isNaN(node))
            return false;
        //fix all bonds link indexes from last to this node
        for (var n = this.last; n >= node; n--) {
            this.container.moveBond(this.id, n, n + 1);
        }
        this.$.points.splice(node, 0, p);
        if (this.edit) {
            var newline = line(0, point_1.default.origin, point_1.default.origin);
            this.g.insertBefore(newline, this.$.lines[0]);
            //this's for ARROW next to last
            this.$.lines.unshift(newline);
        }
        this.refresh();
        this.highlight(false);
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
            edit: false,
            headLength: 14,
            headAngle: 0.78
        });
    };
    Wire.nodeArea = 25;
    return Wire;
}(itemsBoard_1.default));
exports.default = Wire;
function moveToStart($) {
    $.x = $.points[0].x;
    $.y = $.points[0].y;
}
function deleteWireNode(wire, $, node) {
    var last = wire.last;
    //first or last node cannot be deleted, only middle nodes
    if (node <= 0 || node >= last || isNaN(node))
        return;
    wire.container.unbondNode(wire, node);
    wire.container.moveBond(wire.id, last, last - 1);
    var p = $.points.splice(node, 1)[0];
    if (wire.edit) {
        wire.g.removeChild($.lines[0]);
        //use shift for ARROW next to last line
        $.lines.shift();
    }
    return p;
}
function line(ln, a, b, arrow) {
    var options = {
        line: ln,
        x1: a.x,
        y1: a.y,
        x2: b.x,
        y2: b.y
    };
    return !arrow && (options["svg-type"] = "line"), utils_1.tag("line", "", options);
}
function setlines(w, $) {
    $.lines = [];
    for (var i = 0, a = $.points[0], last = w.last; i < last; i++) {
        var b = $.points[i + 1], ln = line(i + 1, a, b);
        $.lines.push(ln);
        w.g.append(ln);
        a = b;
    }
    arrow($);
}
function poly(g, type, line) {
    var polyline = utils_1.tag("polyline", "", {
        "svg-type": type || "line",
        line: line || "0",
        points: "",
    });
    return g.append(polyline), polyline;
}
/**
 *
 * @param $ wire internal data
 * @param node 0-based node to be refreshed.
 *
 * node == undefined, then draw arrow if wire is directional
 * node != undefined, only draw arrow if node is prev|last node for a directional wire
 */
function arrow($, node) {
    if (!$.dir)
        return;
    var c = $.points.length - 1, last = $.points[c], prev = $.points[c - 1], r = $.headLength, angle = Math.atan2(last.y - prev.y, last.x - prev.x), swipe = $.headAngle, p = function (ang) { return new point_1.default((last.x - r * Math.cos(ang)) | 0, (last.y - r * Math.sin(ang)) | 0); };
    //if node is defined, only redraw arrow when node is prev|last node of wire
    if (node != undefined && !(node == c || node == c - 1))
        return;
    dab_1.attr($.arrow, {
        points: [p(angle - swipe), last, p(angle + swipe)].map(function (p) { return p.x + ", " + p.y; }).join(' ')
    });
}
