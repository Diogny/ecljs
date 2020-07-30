"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dab_1 = require("./dab");
const utils_1 = require("./utils");
const types_1 = require("./types");
const itemsBoard_1 = tslib_1.__importDefault(require("./itemsBoard"));
const point_1 = tslib_1.__importDefault(require("./point"));
const rect_1 = tslib_1.__importDefault(require("./rect"));
class Wire extends itemsBoard_1.default {
    constructor(circuit, options) {
        super(circuit, options);
        this.settings.polyline = utils_1.tag("polyline", "", {
            "svg-type": "line",
            line: "0",
            points: "",
        });
        this.g.append(this.settings.polyline);
        this.setPoints(options.points);
        moveToStart.call(this);
        this.onProp && this.onProp({
            id: `#${this.id}`,
            args: {
                id: this.id,
                name: this.name,
                x: this.x,
                y: this.y,
                points: this.settings.points,
                bonds: '[' + this.bonds.map((b) => b.link).join(', ') + ']'
            },
            method: 'create',
            where: 1 //signals it was a change inside the object
        });
    }
    get type() { return types_1.Type.WIRE; }
    get count() { return this.settings.points.length; }
    get last() { return this.settings.points.length - 1; }
    get lastLine() { return this.editMode ? this.settings.lines.length : 0; }
    get isOpen() { return !this.nodeBonds(0) || !this.nodeBonds(this.last); }
    rect() { return rect_1.default.create(this.box); }
    get points() { return Array.from(this.settings.points); }
    get editMode() { return this.settings.edit; }
    set editMode(value) {
        if (this.editMode == value)
            return;
        if (this.editMode) {
            //	will change to false
            //		.destroy lines
            this.settings.lines = this.settings.lines.filter(ln => {
                this.g.removeChild(ln);
                return false;
            });
            //		.recreate polyline
            this.refresh();
            //		.show polyline
            dab_1.removeClass(this.settings.polyline, "hide");
        }
        else {
            //	will change to true
            //		.hide polyline
            dab_1.addClass(this.settings.polyline, "hide");
            //		.create lines
            for (let i = 0, a = this.settings.points[0], cnt = this.last; i < cnt; i++) {
                let b = this.settings.points[i + 1], ln = utils_1.tag("line", "", {
                    "svg-type": "line",
                    line: (i + 1),
                    x1: a.x,
                    y1: a.y,
                    x2: b.x,
                    y2: b.y
                });
                this.settings.lines.push(ln);
                this.g.insertBefore(ln, this.settings.polyline);
                a = b;
            }
        }
        this.settings.edit = value;
    }
    refresh() {
        dab_1.attr(this.settings.polyline, {
            points: this.settings.points.map(p => `${p.x}, ${p.y}`).join(' ')
        });
        return this;
    }
    nodeRefresh(node) {
        if (this.editMode) {
            let ln, p = this.settings.points[node];
            (ln = this.settings.lines[node - 1]) && dab_1.attr(ln, { x2: p.x, y2: p.y });
            (ln = this.settings.lines[node]) && dab_1.attr(ln, { x1: p.x, y1: p.y });
        }
        else {
            this.refresh();
        }
        if (!(node == 0 || node == this.last)) {
            let bond = this.nodeBonds(node), p = this.settings.points[node];
            bond && bond.to.forEach(b => {
                var _a;
                (_a = this.circuit.get(b.id)) === null || _a === void 0 ? void 0 : _a.setNode(b.ndx, p);
            });
        }
        return this;
    }
    translate(dx, dy) {
        super.translate(dx, dy);
        //don't translate bonded end points because it should have been|will be moved by bonded EC or Wire
        let savedEditMode = this.editMode;
        this.editMode = false;
        for (let i = 0, p = this.settings.points[i], end = this.last; i <= end; p = this.settings.points[++i]) {
            if ((i > 0 && i < end) || ((i == 0 || i == end) && !this.nodeBonds(i))) {
                this.setNode(i, point_1.default.translateBy(p, dx, dy));
            }
        }
        this.editMode = savedEditMode;
        return this;
    }
    /**
     * @description returns true if a point is valid
     * @comment later see how to change this to validNode, conflict in !ic.valid(node)
     * 		because we don't know if it's a IC or a wire
     * @param {number} node 0-based point index	it can be -1
     * @returns {boolean} true if point is valid
     */
    valid(node) {
        //(i) => ((i = i | 0) >= 0 && i < points.length);
        //return (node = <any>node | 0) >= -1 && node < this.points.length;	// NOW ACCEPTS  -1
        //	-1  0  ... last  	   -> true
        //	"-1"  "0"  ... "last"  -> true
        //	""  "  "  "1."  "1a"   -> false
        return node >= -1 //String(Number(node)) == node
            && node <= this.last; // NOW ACCEPTS  -1
    }
    getNode(node) {
        let p = this.settings.points[node];
        return (p && { x: p.x, y: p.y });
    }
    getNodeRealXY(node) {
        let p = this.getNode(node);
        return p && point_1.default.create(p);
    }
    appendNode(p) {
        return !this.editMode && (this.settings.points.push(p), this.refresh(), true);
    }
    setNode(node, p) {
        this.settings.points[node].x = p.x | 0;
        this.settings.points[node].y = p.y | 0;
        moveToStart.call(this);
        return this.nodeRefresh(node);
    }
    nodeHighlightable(node) {
        //any Wire node and that it is not a start|end bonded node
        return this.valid(node) //&& this.editMode
            && (!(this.nodeBonds(node) && (node == 0 || node == this.last)));
    }
    setPoints(points) {
        if (!dab_1.isArr(points)
            || points.length < 2)
            throw 'Poliwire min 2 points';
        if (!this.editMode) {
            this.settings.points = points.map(p => new point_1.default(p.x | 0, p.y | 0));
            moveToStart.call(this);
            this.settings.lines = [];
            this.refresh();
        }
        return this;
    }
    overNode(p, ln) {
        let endPoint = ln, lineCount = this.settings.lines.length, isLine = (ln) => ln && (ln <= lineCount), isAround = (p, x, y) => (x >= p.x - this.settings.pad) &&
            (x <= p.x + this.settings.pad) &&
            (y >= p.y - this.settings.pad) &&
            (y <= p.y + this.settings.pad);
        //if not in editMode, then ln will be 0, so reset to 1, and last point is the last
        !this.editMode && (ln = 1, endPoint = this.last, lineCount = 1);
        if (isLine(ln)) {
            return isAround(this.settings.points[ln - 1], p.x, p.y) ?
                ln - 1 :
                (isAround(this.settings.points[endPoint], p.x, p.y) ? endPoint : -1);
        }
        return -1;
    }
    findLineNode(p, line) {
        let fn = (np) => (Math.pow(p.x - np.x, 2) + Math.pow(p.y - np.y, 2)) <= 25;
        ((line <= 0 || line >= this.last) && (line = this.findNode(p), 1))
            || fn(this.settings.points[line])
            || fn(this.settings.points[--line])
            || (line = -1);
        return line;
    }
    //don't care if wire is in editMode or not
    findNode(p) {
        for (let i = 0, thisP = this.settings.points[i], len = this.settings.points.length; i < len; thisP = this.settings.points[++i]) {
            //radius 5 =>  5^2 = 25
            if ((Math.pow(p.x - thisP.x, 2) + Math.pow(p.y - thisP.y, 2)) <= 25)
                return i;
        }
        return -1;
    }
    deleteLine(line) {
        //cannot delete first or last line
        if (line <= 1 || line >= this.last)
            return false;
        let savedEditMode = this.editMode;
        this.editMode = false;
        deleteWireNode.call(this, line);
        deleteWireNode.call(this, line - 1);
        moveToStart.call(this);
        this.editMode = savedEditMode;
        return true;
    }
    deleteNode(node) {
        let savedEditMode = this.editMode, p;
        this.editMode = false;
        p = deleteWireNode.call(this, node);
        moveToStart.call(this);
        this.editMode = savedEditMode;
        return p;
    }
    insertNode(node, p) {
        //cannot insert node in first or after last position
        if (node <= 0 || node > this.last || isNaN(node))
            return false;
        let savedEditMode = this.editMode;
        this.editMode = false;
        //fix all bonds link indexes from last to this node
        for (let n = this.last; n >= node; n--) {
            fixBondIndexes.call(this, n, n + 1);
        }
        this.settings.points.splice(node, 0, p);
        this.editMode = savedEditMode;
        return true;
    }
    /**
     * @description standarizes a wire node number to 0..points.length
     * @param {number} node 0-based can be -1:last 0..points.length-1
     * @returns {number} -1 for wrong node or standarized node number, where -1 == last, otherwise node
     */
    standarizeNode(node) {
        if (this.valid(node))
            return node == -1 ? this.last : node;
        return -1;
    }
    propertyDefaults() {
        return dab_1.extend(super.propertyDefaults(), {
            name: "wire",
            class: "wire",
            pad: 5,
            edit: false
        });
    }
}
exports.default = Wire;
function moveToStart() {
    this.move(this.settings.points[0].x, this.settings.points[0].y);
}
function deleteWireNode(node) {
    let last = this.last;
    //first or last node cannot be deleted, only middle nodes
    if (node <= 0 || node >= last || isNaN(node))
        return;
    this.unbondNode(node);
    fixBondIndexes.call(this, last, last - 1);
    return this.settings.points.splice(node, 1)[0];
}
function fixBondIndexes(node, newIndex) {
    let lastBond = this.nodeBonds(node);
    if (!lastBond)
        return false;
    //fix this from index
    lastBond.from.ndx = newIndex;
    //because it's a wire last node, it has only one destination, so fix all incoming indexes
    lastBond.to.forEach(bond => {
        let compTo = this.circuit.get(bond.id), compToBonds = compTo === null || compTo === void 0 ? void 0 : compTo.nodeBonds(bond.ndx);
        compToBonds === null || compToBonds === void 0 ? void 0 : compToBonds.to.filter(b => b.id == this.id).forEach(b => {
            b.ndx = newIndex;
        });
    });
    //move last bond entry
    delete this.settings.bonds[node];
    this.settings.bonds[newIndex] = lastBond;
    return true;
}
