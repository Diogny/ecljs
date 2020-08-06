"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dab_1 = require("./dab");
const utils_1 = require("./utils");
//... in progress...
class UIProp {
    constructor(options) {
        //set default values
        this.settings = {
            type: "text",
            selected: false,
            editable: false,
            getter: "value",
            htmlSelect: false,
            selectCount: 1,
            selectMultiple: false
        };
        if (!options
            || !(this.settings.html = (dab_1.isElement(options.tag) ? (options.tag) : utils_1.qS(options.tag))))
            throw 'wrong options';
        //set event handler if any, this uses setter for type checking
        this.onChange = options.onChange;
        //copy toString function
        this.settings.toStringFn = options.toStringFn;
        //self contain inside the html dom object for onchange event
        this.html.dab = this;
        //set properties
        this.settings.tag = options.tag;
        this.settings.name = this.html.getAttribute("name");
        this.settings.id = this.html.id || dab_1.attr(this.html, "prop-id") || ('property' + UIProp._propId++);
        switch (this.nodeName) {
            case 'input':
                this.settings.type = this.html.type.toLowerCase();
                this.settings.editable = true;
                switch (this.type) {
                    case 'radio':
                    case 'checkbox':
                        this.settings.type = "boolean";
                        this.settings.getter = 'checked';
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
                        this.settings.type = 'text';
                }
                break;
            case 'textarea':
                this.settings.type = 'text';
                this.settings.editable = true;
                break;
            case 'select':
                this.settings.htmlSelect = true;
                switch (this.html.type.toLowerCase()) {
                    case 'select-one':
                        this.settings.getter = "selectedIndex"; //'<any>null';
                        break;
                    case 'select-multiple':
                        this.settings.getter = "selectedOptions"; //'<any>null'
                        this.settings.selectMultiple = true;
                        break;
                }
                this.settings.type = "integer";
                //define properties for 'SELECT'
                let index = -1;
                this.settings.selectCount = this.html.length;
                //later return an array for select multiple
                dab_1.dP(this, "index", {
                    get: () => index,
                    set(value) {
                        (value >= 0 && value < this.settings.selectCount) && // this.options.length
                            ((index != -1) && (this.html.options[index].selected = !1),
                                this.html.options[index = value].selected = !0,
                                this.selectionUiChanged());
                    }
                });
                dab_1.dP(this, "selectedOption", {
                    get: () => this.html.options[this.html.selectedIndex]
                });
                break;
            default:
                if (UIProp.textOnly.indexOf(this.nodeName) >= 0) {
                    this.settings.getter = 'innerText';
                }
                else
                    throw `Unsupported HTML tag: ${this.nodeName}`;
        }
        ;
        //later see how can I register change event only for editable properties
        this.html.addEventListener('change', this.selectionUiChanged);
    }
    get id() { return this.settings.id; }
    get type() { return this.settings.type; }
    get name() { return this.settings.name; }
    get tag() { return this.settings.tag; }
    get html() { return this.settings.html; }
    get editable() { return this.settings.editable; }
    get nodeName() { return this.html.nodeName.toLowerCase(); }
    get onChange() { return this.settings.onChange; }
    set onChange(fn) {
        dab_1.isFn(fn) && (this.settings.onChange = fn);
    }
    get value() {
        let val = this.html[this.settings.getter]; //select.selectedOptions
        if (!this.settings.htmlSelect) {
            switch (this.type) {
                case "integer":
                    return isNaN(val = parseInt(val)) ? 0 : val;
                case "number":
                    return isNaN(val = parseFloat(val)) ? 0 : val;
            }
            return val;
        }
        else if (this.settings.selectMultiple) {
            return [].map.call(val, (option) => option.value);
        }
        else
            return this.html.options[val].value;
    }
    set value(val) {
        if (!this.settings.htmlSelect) {
            let valtype = dab_1.typeOf(val);
            if ((this.type == "text" && valtype == "string") ||
                (this.type == "boolean" && valtype == "boolean") ||
                (this.type == "integer" && dab_1.isInt(val)) ||
                (this.type == "number" && dab_1.isNumeric(val)))
                this.html[this.settings.getter] = val;
        }
        else {
            //this.getsetSelect(<HTMLSelectElement>this.html, 'selectedIndex', splat(val));
            if (this.settings.selectMultiple) {
                let values = dab_1.splat(val).map((num) => num + '');
                [].forEach.call(this.html.options, (option) => {
                    (values.indexOf(option.value) >= 0) && (option.selected = true);
                });
            }
            else {
                if (dab_1.isStr(this.value)) {
                    val = [].findIndex.call(this.html.options, (option) => option.value == val);
                }
                this.html.selectedIndex = val | 0;
            }
        }
        //trigger the property change event
        this.selectionUiChanged(null);
    }
    toString() {
        return this.settings.toStringFn ? this.settings.toStringFn() : `${this.id}: ${this.value}`;
    }
    selectionUiChanged(e) {
        //when comming from UI, this is the DOM Element
        // 	otherwise it's the property
        let prop = this instanceof UIProp ? this : this.dab;
        if (prop && prop.onChange)
            prop.onChange(prop.value, //this cache current value
            (e) ? 1 : 2, // 1 == 'ui' : 2 == 'prop'
            prop, //not needed, but just in case
            e //event if UI triggered
            );
    }
}
exports.default = UIProp;
UIProp.textOnly = "a|abbr|acronym|b|bdo|big|cite|code|dfn|em|i|kbd|label|legend|li|q|samp|small|span|strong|sub|sup|td|th|tt|var".split('|');
UIProp._propId = 1;