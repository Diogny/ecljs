"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dab_1 = require("./dab");
var tmpl = "{base.comp.name}-{base.count}";
var defaults = function (type, name) { return ({
    name: name,
    comp: {
        type: type,
        name: name,
        meta: {
            nameTmpl: tmpl,
            nodes: []
        },
        properties: {}
    }
}); };
var Comp = /** @class */ (function () {
    function Comp(options) {
        var that = this, template = options.tmpl;
        delete options.tmpl;
        this.$ = dab_1.obj(options);
        if (template) {
            var base = Comp.find(template.name);
            this.$.data = base.data;
            this.$.meta = JSON.parse(JSON.stringify(base.meta));
            template.label && (this.$.meta.label = dab_1.obj(template.label));
            template.nodeLabels.forEach(function (lbl, ndx) {
                that.$.meta.nodes.list[ndx].label = lbl;
            });
        }
        !this.$.meta.nameTmpl && (this.$.meta.nameTmpl = tmpl);
        if (!Comp.store(this.$.name, this))
            throw "duplicated: " + this.$.name;
    }
    Object.defineProperty(Comp.prototype, "name", {
        get: function () { return this.$.name; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Comp.prototype, "library", {
        get: function () { return this.$.library; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Comp.prototype, "type", {
        get: function () { return this.$.type; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Comp.prototype, "data", {
        get: function () { return this.$.data; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Comp.prototype, "props", {
        get: function () { return this.$.properties; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Comp.prototype, "meta", {
        get: function () { return this.$.meta; },
        enumerable: false,
        configurable: true
    });
    Comp.init = function (list) {
        var set = Comp.map;
        if (set == null) {
            set = new Map();
        }
        list.forEach(function (c) {
            set.set(c.name, c.comp);
        });
        return set;
    };
    Object.defineProperty(Comp, "size", {
        get: function () { return Comp.map.size; },
        enumerable: false,
        configurable: true
    });
    Comp.map = Comp.init([
        defaults("utils", "label"),
        defaults("utils", "tooltip"),
        defaults("utils", "h-node"),
        defaults("wire", "wire")
    ]);
    Comp.register = function (options) { return new Comp(options); };
    Comp.store = function (name, comp) {
        return Comp.map.has(name) ?
            false :
            (Comp.map.set(name, comp), true);
    };
    Comp.has = function (name) { return Comp.map.has(name); };
    Comp.find = function (name) {
        return Comp.map.get(name);
    };
    return Comp;
}());
exports.default = Comp;
