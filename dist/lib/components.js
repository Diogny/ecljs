"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var dab_1 = require("./dab");
//const tmpl = "{base.comp.name}-{base.count}";
var defaults = function (type, name) { return ({
    name: name,
    comp: {
        type: type,
        name: name,
        meta: {
            //nameTmpl: tmpl,
            nodes: []
        },
        props: {}
    }
}); };
var CompStore = /** @class */ (function () {
    function CompStore(library) {
        var _this = this;
        this.has = function (name) { return _this.store.has(name); };
        /**
         * @description find a component by name
         * @param name component name
         */
        this.find = function (name) {
            var e_1, _a;
            var comp = _this.store.get(name);
            if (!comp) {
                try {
                    //look by meta.nameTmpl, the hard way; for C, R, F, VR, BZ
                    for (var _b = tslib_1.__values(_this.store.values()), _c = _b.next(); !_c.done; _c = _b.next()) {
                        var item = _c.value;
                        if (item.meta.nameTmpl == name)
                            return item;
                    }
                }
                catch (e_1_1) { e_1 = { error: e_1_1 }; }
                finally {
                    try {
                        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
                    }
                    finally { if (e_1) throw e_1.error; }
                }
            }
            return dab_1.obj(comp);
        };
        this.name = library.name;
        this.type = library.type;
        this.version = library.version;
        this.store = new Map();
        //register system components
        ([
            defaults("utils", "label"),
            defaults("utils", "tooltip"),
            defaults("utils", "h-node"),
            defaults("wire", "wire")
        ]).forEach(function (c) { return _this.store.set(c.name, c.comp); });
        //register library
        library.list.forEach(function (options) {
            var template = options.tmpl;
            if (template) {
                var base = _this.find(template.name);
                if (!base)
                    throw "";
                options.data = base.data;
                options.meta = JSON.parse(JSON.stringify(base.meta));
                template.label && (options.meta.label = dab_1.obj(template.label));
                template.nodeLabels.forEach(function (lbl, ndx) {
                    options.meta.nodes.list[ndx].label = lbl;
                });
            }
            //new Comp(option)
            if (_this.store.has(options.name))
                throw "duplicated: " + options.name;
            else
                _this.store.set(options.name, options);
        });
    }
    Object.defineProperty(CompStore.prototype, "keys", {
        /**
         * returns all registered components, except wire and system components
         */
        get: function () {
            return Array.from(this.store.values())
                .filter(function (c) { return !(c.type == "utils" || c.type == "wire"); })
                .map(function (c) { return c.name; });
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompStore.prototype, "size", {
        get: function () { return this.store.size; },
        enumerable: false,
        configurable: true
    });
    return CompStore;
}());
exports.default = CompStore;
