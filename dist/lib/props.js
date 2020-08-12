"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropContainer = exports.UIProp = exports.ReactProp = void 0;
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var dab_1 = require("./dab");
var utils_1 = require("./utils");
var ReactProp = /** @class */ (function (_super) {
    tslib_1.__extends(ReactProp, _super);
    function ReactProp(options) {
        var _this = _super.call(this, options) || this;
        dab_1.isFn(options.onChange) && (_this.onChange = options.onChange);
        return _this;
    }
    Object.defineProperty(ReactProp.prototype, "data", {
        get: function () { return this.__s.data; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReactProp.prototype, "value", {
        get: function () { return this.__s.value; },
        set: function (val) {
            this.__s.value = val;
            this.onChange && this.onChange(val, 2, this, void 0);
        },
        enumerable: false,
        configurable: true
    });
    ReactProp.prototype.dispose = function () { };
    ReactProp.prototype.defaults = function () {
        return {
            data: {},
            value: void 0
        };
    };
    return ReactProp;
}(interfaces_1.Base));
exports.ReactProp = ReactProp;
var UIProp = /** @class */ (function (_super) {
    tslib_1.__extends(UIProp, _super);
    function UIProp(options) {
        var _this = _super.call(this, options) || this;
        if (!(_this.__s.html = (dab_1.isDOM(options.tag) ? (options.tag) : utils_1.qS(options.tag))))
            throw 'wrong options';
        _this.html.dab = _this;
        switch (_this.nodeName) {
            case 'input':
                _this.__s.type = _this.html.type.toLowerCase();
                _this.__s.editable = true;
                switch (_this.type) {
                    case 'radio':
                    case 'checkbox':
                        _this.__s.type = "boolean";
                        _this.__s.getter = 'checked';
                        break;
                    case 'submit':
                    case 'button':
                        throw 'HTML input tag type invalid';
                    case 'text':
                    case 'number':
                        //TML5 input types stays the same
                        break;
                    case 'password':
                    case 'hidden': //prop.type is text
                    default:
                        //•color	•date	•datetime	•datetime-local	•email	•month	•number	•range	•search
                        //•tel	•time	•url	•week
                        _this.__s.type = 'text';
                }
                break;
            case 'textarea':
                _this.__s.type = 'text';
                _this.__s.editable = true;
                break;
            case 'select':
                _this.__s.htmlSelect = true;
                switch (_this.html.type.toLowerCase()) {
                    case 'select-one':
                        _this.__s.getter = "selectedIndex"; //'<any>null';
                        break;
                    case 'select-multiple':
                        _this.__s.getter = "selectedOptions"; //'<any>null'
                        _this.__s.selectMultiple = true;
                        break;
                }
                _this.__s.type = "integer";
                //define properties for 'SELECT'
                var index_1 = -1;
                _this.__s.selectCount = _this.html.length;
                //later return an array for select multiple
                dab_1.dP(_this, "index", {
                    get: function () { return index_1; },
                    set: function (value) {
                        (value >= 0 && value < this.__s.selectCount) && // this.options.length
                            ((index_1 != -1) && (this.html.options[index_1].selected = !1),
                                this.html.options[index_1 = value].selected = !0,
                                this.trigger());
                    }
                });
                dab_1.dP(_this, "selectedOption", {
                    get: function () { return _this.html.options[_this.html.selectedIndex]; }
                });
                break;
            default:
                //later check this for all text HTMLElements
                _this.__s.getter = 'innerHTML';
        }
        ;
        //this's set only if it's an editable property
        _this.react
            && _this.html.addEventListener('change', _this.trigger);
        return _this;
    }
    Object.defineProperty(UIProp.prototype, "type", {
        get: function () { return this.__s.type; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "html", {
        get: function () { return this.__s.html; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "editable", {
        get: function () { return this.__s.editable; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "tag", {
        get: function () { return this.__s.tag; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "nodeName", {
        get: function () { return this.html.nodeName.toLowerCase(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "react", {
        get: function () { return this.editable || this.__s.htmlSelect; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "value", {
        get: function () {
            if (!this.react) {
                return this.__s.value;
            }
            var val = this.html[this.__s.getter]; //select.selectedOptions
            if (!this.__s.htmlSelect) {
                switch (this.type) {
                    case "integer":
                        return isNaN(val = parseInt(val)) ? 0 : val;
                    case "number":
                        return isNaN(val = parseFloat(val)) ? 0 : val;
                }
                return val;
            }
            else if (this.__s.selectMultiple) {
                return [].map.call(val, function (option) { return option.value; });
            }
            else
                return this.html.options[val].value;
        },
        set: function (val) {
            if (!this.react) {
                this.__s.value = val;
                //call onchange to get UI value
                var transfValue = this.onChange && this.onChange(val, 2, this, void 0);
                //write to DOM transformed value, if undefined write "val"
                this.html[this.__s.getter] = (transfValue == undefined) ? val : transfValue;
                return;
            }
            if (!this.__s.htmlSelect) {
                var valtype = dab_1.typeOf(val);
                if ((this.type == "text" && valtype == "string") ||
                    (this.type == "boolean" && valtype == "boolean") ||
                    (this.type == "integer" && dab_1.isInt(val)) ||
                    (this.type == "number" && dab_1.isNumeric(val)))
                    this.html[this.__s.getter] = val;
            }
            else {
                if (this.__s.selectMultiple) {
                    var values_1 = dab_1.splat(val).map(function (num) { return num + ''; });
                    [].forEach.call(this.html.options, function (option) {
                        (values_1.indexOf(option.value) >= 0) && (option.selected = true);
                    });
                }
                else {
                    if (dab_1.isStr(this.value)) {
                        val = [].findIndex.call(this.html.options, function (option) { return option.value == val; });
                    }
                    this.html.selectedIndex = val | 0;
                }
            }
            this.trigger(null);
        },
        enumerable: false,
        configurable: true
    });
    UIProp.prototype.dispose = function () {
        this.react
            && this.html.removeEventListener('change', this.trigger);
    };
    UIProp.prototype.trigger = function (e) {
        //when comming from UI, this is the DOM Element
        // 	otherwise it's the property
        var prop = this instanceof UIProp ? this : this.dab;
        if (!prop || !prop.onChange)
            return;
        prop.html.blur();
        prop.onChange(prop.value, //this cache current value
        (e) ? 1 : 2, // 1 == 'ui' : 2 == 'prop'
        prop, //not needed, but just in case
        e //event if UI triggered
        );
    };
    UIProp.prototype.defaults = function () {
        return {
            tag: "",
            onChange: void 0,
            data: {},
            html: void 0,
            type: "text",
            selected: false,
            editable: false,
            getter: "value",
            htmlSelect: false,
            selectCount: 1,
            selectMultiple: false,
            value: void 0
        };
    };
    return UIProp;
}(ReactProp));
exports.UIProp = UIProp;
var PropContainer = /** @class */ (function (_super) {
    tslib_1.__extends(PropContainer, _super);
    function PropContainer(props) {
        var _this = _super.call(this, {}) || this;
        utils_1.each(props, function (options, key) { return _this.root[key] = hook(_this, key, options); });
        return _this;
    }
    Object.defineProperty(PropContainer.prototype, "root", {
        get: function () { return this.__s.root; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PropContainer.prototype, "modified", {
        get: function () { return this.__s.modified; },
        set: function (value) { this.__s.modified = value; },
        enumerable: false,
        configurable: true
    });
    PropContainer.prototype.defaults = function () {
        return {
            root: {},
            modified: false
        };
    };
    return PropContainer;
}(interfaces_1.Base));
exports.PropContainer = PropContainer;
function hook(parent, name, options) {
    var 
    //defaults to "true" if not defined
    onModify = options.onModify == undefined ? true : options.onModify, p = (options.tag) ? new UIProp(options) : new ReactProp(options), modified = false, prop = {};
    dab_1.dP(prop, "value", {
        get: function () {
            return p.value;
        },
        set: function (value) {
            p.value = value;
            //trigger father's modified only if defined, defaults to "true"
            modified = true;
            onModify && (parent.__s.modified = true);
        }
    });
    dab_1.dP(prop, "name", { get: function () { return name; } });
    dab_1.dP(prop, "prop", { get: function () { return p; } });
    dab_1.dP(prop, "modified", { get: function () { return modified; } });
    return prop;
}
