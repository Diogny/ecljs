"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropContainer = exports.UIProp = exports.ReactProp = void 0;
var tslib_1 = require("tslib");
var interfaces_1 = require("./interfaces");
var dab_1 = require("./dab");
var utils_1 = require("./utils");
var ReactProp = /** @class */ (function (_super) {
    tslib_1.__extends(ReactProp, _super);
    /**
     * @description creates a react property
     * @param options [key]::value object as description
     *
     * valid [options] are:
     * - value: property default value, default is undefined.
     * - _: [key]::value object with internal data
     * - onChange: (value: any, where: number, prop: IReactProp, e: any): any | void
     */
    function ReactProp(options) {
        var _this = _super.call(this, options) || this;
        dab_1.isFn(options.onChange) && (_this.onChange = options.onChange);
        return _this;
    }
    Object.defineProperty(ReactProp.prototype, "_", {
        /**
         * @description returns an object [key]::any with the property inside data
         */
        get: function () { return this.$._; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ReactProp.prototype, "value", {
        /**
         * @description get/set the value of the react property
         */
        get: function () { return this.$.value; },
        /**
         * @param {any} val setters new value
         */
        set: function (val) {
            this.$.value = val;
            this.onChange && this.onChange(val, 2, this, void 0);
        },
        enumerable: false,
        configurable: true
    });
    ReactProp.prototype.dispose = function () { };
    /**
     * @description class property defaults. Only these keys are copied internally
     */
    ReactProp.prototype.defaults = function () {
        return {
            _: {},
            value: void 0
        };
    };
    return ReactProp;
}(interfaces_1.Base));
exports.ReactProp = ReactProp;
var UIProp = /** @class */ (function (_super) {
    tslib_1.__extends(UIProp, _super);
    /**
     * @description creates a react UI property
     * @param options [key]::value object as description
     *
     * valid [options] are:
     * - tag: this's required as a valid DOM selector query
     * - value: property default value, default is undefined.
     * - _: [key]::value object with internal data
     * - onChange: (value: any, where: number, prop: IReactProp, e: any): any | void
     */
    function UIProp(options) {
        var _this = _super.call(this, options) || this;
        if (!(_this.$.html = (dab_1.isDOM(options.tag) ? (options.tag) : utils_1.qS(options.tag))))
            throw 'wrong options';
        _this.html.dab = _this;
        switch (_this.nodeName) {
            case 'input':
                _this.$.type = _this.html.type.toLowerCase();
                _this.$.editable = true;
                switch (_this.type) {
                    case 'radio':
                    case 'checkbox':
                        _this.$.type = "boolean";
                        _this.$.getter = 'checked';
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
                        _this.$.type = 'text';
                }
                break;
            case 'textarea':
                _this.$.type = 'text';
                _this.$.editable = true;
                break;
            case 'select':
                _this.$.htmlSelect = true;
                switch (_this.html.type.toLowerCase()) {
                    case 'select-one':
                        _this.$.getter = "selectedIndex"; //'<any>null';
                        break;
                    case 'select-multiple':
                        _this.$.getter = "selectedOptions"; //'<any>null'
                        _this.$.selectMultiple = true;
                        break;
                }
                _this.$.type = "integer";
                //define properties for 'SELECT'
                var index_1 = -1;
                _this.$.selectCount = _this.html.length;
                //later return an array for select multiple
                dab_1.dP(_this, "index", {
                    get: function () { return index_1; },
                    set: function (value) {
                        (value >= 0 && value < this.$.selectCount) && // this.options.length
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
                _this.$.getter = 'innerHTML';
        }
        ;
        //this's set only if it's an editable property
        _this.react
            && _this.html.addEventListener('change', _this.trigger);
        return _this;
    }
    Object.defineProperty(UIProp.prototype, "type", {
        get: function () { return this.$.type; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "html", {
        get: function () { return this.$.html; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "editable", {
        get: function () { return this.$.editable; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "tag", {
        get: function () { return this.$.tag; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "nodeName", {
        get: function () { return this.html.nodeName.toLowerCase(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "react", {
        get: function () { return this.editable || this.$.htmlSelect; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "value", {
        get: function () {
            if (!this.react) {
                return this.$.value;
            }
            var val = this.html[this.$.getter]; //select.selectedOptions
            if (!this.$.htmlSelect) {
                switch (this.type) {
                    case "integer":
                        return isNaN(val = parseInt(val)) ? 0 : val;
                    case "number":
                        return isNaN(val = parseFloat(val)) ? 0 : val;
                }
                return val;
            }
            else if (this.$.selectMultiple) {
                return [].map.call(val, function (option) { return option.value; });
            }
            else
                return this.html.options[val].value;
        },
        set: function (val) {
            if (!this.react) {
                this.$.value = val;
                //call onchange to get UI value
                var transfValue = this.onChange && this.onChange(val, 2, this, void 0);
                //write to DOM transformed value, if undefined write "val"
                this.html[this.$.getter] = (transfValue == undefined) ? val : transfValue;
                return;
            }
            if (!this.$.htmlSelect) {
                var valtype = dab_1.typeOf(val);
                if ((this.type == "text" && valtype == "string") ||
                    (this.type == "boolean" && valtype == "boolean") ||
                    (this.type == "integer" && dab_1.isInt(val)) ||
                    (this.type == "number" && dab_1.isNumeric(val)))
                    this.html[this.$.getter] = val;
            }
            else {
                if (this.$.selectMultiple) {
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
        if (!prop)
            return;
        prop.html.blur();
        prop.onChange && prop.onChange(prop.value, //this cache current value
        (e) ? 1 : 2, // 1 == 'ui' : 2 == 'prop'
        prop, //not needed, but just in case
        e //event if UI triggered
        );
    };
    /**
     * @description class property defaults. Only these keys are copied internally
     */
    UIProp.prototype.defaults = function () {
        return {
            _: {},
            value: void 0,
            tag: "",
            html: void 0,
            type: "text",
            selected: false,
            editable: false,
            getter: "value",
            htmlSelect: false,
            selectCount: 1,
            selectMultiple: false,
        };
    };
    return UIProp;
}(ReactProp));
exports.UIProp = UIProp;
var PropContainer = /** @class */ (function (_super) {
    tslib_1.__extends(PropContainer, _super);
    /**
     * @description creates a property container
     * @param props [key]::value object
     *
     * [key] is property name, ::value is valid prop [options]:
     * - value: set prop default value.
     * - _: [key]::value object with internal data
     * - onChange: (value: any, where: number, prop: IReactProp, e: any): any | void
     * - modify: triggers container modified, default to true
     */
    function PropContainer(props) {
        var _this = _super.call(this) || this;
        utils_1.each(props, function (options, key) { return _this.$._[key] = hook(_this, key, options); });
        return _this;
    }
    Object.defineProperty(PropContainer.prototype, "props", {
        get: function () { return this.$._; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(PropContainer.prototype, "modified", {
        get: function () { return this.$.modified; },
        set: function (value) { this.$.modified = value; },
        enumerable: false,
        configurable: true
    });
    /**
     * @description class property defaults. Only these keys are copied internally
     */
    PropContainer.prototype.defaults = function () {
        return {
            _: {},
            modified: false
        };
    };
    return PropContainer;
}(interfaces_1.Base));
exports.PropContainer = PropContainer;
/**
 * @description creates a property hook to container properties
 * @param parent container
 * @param name hook/prop name
 * @param options [key]::value options
 *
 * valid [options] are:
 * - value: property default value, default is undefined.
 * - _: [key]::value object with internal data
 * - onChange: (value: any, where: number, prop: IReactProp, e: any): any | void
 * - modify: triggers container modified, default to true
 * - label --experiment to use shorter names
 */
function hook(parent, name, options) {
    var 
    //defaults to "true" if not defined
    onModify = options.modify == undefined ? true : options.modify, p = (options.tag) ? new UIProp(options) : new ReactProp(options), modified = false, prop = {};
    dab_1.dP(prop, "value", {
        get: function () {
            return p.value;
        },
        set: function (value) {
            p.value = value;
            //trigger father's modified only if defined, defaults to "true"
            modified = true;
            onModify && (parent.$.modified = true);
        }
    });
    dab_1.dP(prop, "name", { get: function () { return name; } });
    dab_1.dP(prop, "modified", { get: function () { return modified; } });
    dab_1.dP(prop, "prop", { get: function () { return p; } });
    //shortcut returns the data of the property
    dab_1.dP(prop, "_", { get: function () { return p._; } });
    Object.freeze(prop);
    return prop;
}
