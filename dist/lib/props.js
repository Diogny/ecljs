"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dab_1 = require("./dab");
var utils_1 = require("./utils");
//... in progress...
var UIProp = /** @class */ (function () {
    function UIProp(options) {
        var _this = this;
        //set default values
        this.__s = {
            type: "text",
            selected: false,
            editable: false,
            getter: "value",
            htmlSelect: false,
            selectCount: 1,
            selectMultiple: false,
        };
        if (!options
            || !(this.__s.html = (dab_1.isDOM(options.tag) ? (options.tag) : utils_1.qS(options.tag))))
            throw 'wrong options';
        //this's useful, p.theme.value during initialization to have a local needed value
        this.__s.data = options.data || {};
        //set event handler if any, this uses setter for type checking
        this.onChange = options.onChange;
        //copy toString function
        this.__s.toStringFn = options.toStringFn;
        //self contain inside the html dom object for onchange event
        this.html.dab = this;
        //set properties
        this.__s.tag = options.tag;
        this.__s.name = this.html.getAttribute("name");
        this.__s.id = this.html.id || dab_1.attr(this.html, "prop-id") || ('property' + UIProp._propId++);
        switch (this.nodeName) {
            case 'input':
                this.__s.type = this.html.type.toLowerCase();
                this.__s.editable = true;
                switch (this.type) {
                    case 'radio':
                    case 'checkbox':
                        this.__s.type = "boolean";
                        this.__s.getter = 'checked';
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
                        this.__s.type = 'text';
                }
                break;
            case 'textarea':
                this.__s.type = 'text';
                this.__s.editable = true;
                break;
            case 'select':
                this.__s.htmlSelect = true;
                switch (this.html.type.toLowerCase()) {
                    case 'select-one':
                        this.__s.getter = "selectedIndex"; //'<any>null';
                        break;
                    case 'select-multiple':
                        this.__s.getter = "selectedOptions"; //'<any>null'
                        this.__s.selectMultiple = true;
                        break;
                }
                this.__s.type = "integer";
                //define properties for 'SELECT'
                var index_1 = -1;
                this.__s.selectCount = this.html.length;
                //later return an array for select multiple
                dab_1.dP(this, "index", {
                    get: function () { return index_1; },
                    set: function (value) {
                        (value >= 0 && value < this.__s.selectCount) && // this.options.length
                            ((index_1 != -1) && (this.html.options[index_1].selected = !1),
                                this.html.options[index_1 = value].selected = !0,
                                this.selectionUiChanged());
                    }
                });
                dab_1.dP(this, "selectedOption", {
                    get: function () { return _this.html.options[_this.html.selectedIndex]; }
                });
                break;
            default:
                if (UIProp.textOnly.indexOf(this.nodeName) >= 0) {
                    this.__s.getter = 'innerText';
                }
                else
                    throw "Unsupported HTML tag: " + this.nodeName;
        }
        ;
        //later see how can I register change event only for editable properties
        this.html.addEventListener('change', this.selectionUiChanged);
    }
    Object.defineProperty(UIProp.prototype, "id", {
        get: function () { return this.__s.id; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "type", {
        get: function () { return this.__s.type; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "name", {
        get: function () { return this.__s.name; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "tag", {
        get: function () { return this.__s.tag; },
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
    Object.defineProperty(UIProp.prototype, "data", {
        get: function () { return this.__s.data; },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "nodeName", {
        get: function () { return this.html.nodeName.toLowerCase(); },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "onChange", {
        get: function () { return this.__s.onChange; },
        set: function (fn) {
            dab_1.isFn(fn) && (this.__s.onChange = fn);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(UIProp.prototype, "value", {
        get: function () {
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
            if (!this.__s.htmlSelect) {
                var valtype = dab_1.typeOf(val);
                if ((this.type == "text" && valtype == "string") ||
                    (this.type == "boolean" && valtype == "boolean") ||
                    (this.type == "integer" && dab_1.isInt(val)) ||
                    (this.type == "number" && dab_1.isNumeric(val)))
                    this.html[this.__s.getter] = val;
            }
            else {
                //this.getsetSelect(<HTMLSelectElement>this.html, 'selectedIndex', splat(val));
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
            //trigger the property change event
            this.selectionUiChanged(null);
        },
        enumerable: false,
        configurable: true
    });
    UIProp.prototype.toString = function () {
        return this.__s.toStringFn ? this.__s.toStringFn() : this.id + ": " + this.value;
    };
    UIProp.prototype.selectionUiChanged = function (e) {
        //when comming from UI, this is the DOM Element
        // 	otherwise it's the property
        var prop = this instanceof UIProp ? this : this.dab;
        if (prop && prop.onChange) {
            prop.html.blur();
            prop.onChange(prop.value, //this cache current value
            (e) ? 1 : 2, // 1 == 'ui' : 2 == 'prop'
            prop, //not needed, but just in case
            e //event if UI triggered
            );
        }
    };
    UIProp.textOnly = "a|abbr|acronym|b|bdo|big|cite|code|dfn|em|i|kbd|label|legend|li|q|samp|small|span|strong|sub|sup|td|th|tt|var".split('|');
    UIProp._propId = 1;
    return UIProp;
}());
exports.default = UIProp;
