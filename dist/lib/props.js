"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PropContainer = exports.UIProp = exports.ReactProp = void 0;
const dab_1 = require("dabbjs/dist/lib/dab");
const dom_1 = require("dabbjs/dist/lib/dom");
const misc_1 = require("dabbjs/dist/lib/misc");
const interfaces_1 = require("./interfaces");
class ReactProp extends interfaces_1.Base {
    /**
     * @description creates a react property
     * @param options [key]::value object as description
     *
     * valid [options] are:
     * - value: property default value, default is undefined.
     * - _: [key]::value object with internal data
     * - onChange: (value: any, where: number, prop: IReactProp, e: any): any | void
     */
    constructor(options) {
        super(options);
        (0, dab_1.isFn)(options.onChange) && (this.onChange = options.onChange);
    }
    /**
     * @description returns an object [key]::any with the property inside data
     */
    get _() { return this.$._; }
    /**
     * @description get/set the value of the react property
     */
    get value() { return this.$.value; }
    /**
     * @param {any} val setters new value
     */
    set value(val) {
        this.$.value = val;
        this.onChange && this.onChange(val, 2, this, void 0);
    }
    dispose() {
        //
    }
    /**
     * @description class property defaults. Only these keys are copied internally
     */
    defaults() {
        return {
            _: {},
            value: void 0
        };
    }
}
exports.ReactProp = ReactProp;
class UIProp extends ReactProp {
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
    constructor(options) {
        super(options);
        if (!(this.$.html = ((0, dom_1.isDOM)(options.tag) ? (options.tag) : (0, dom_1.qS)(options.tag))))
            throw new Error('wrong options');
        this.html.dab = this;
        switch (this.nodeName) {
            case 'input':
                this.$.type = this.html.type.toLowerCase();
                this.$.editable = true;
                switch (this.type) {
                    case 'radio':
                    case 'checkbox':
                        this.$.type = "boolean";
                        this.$.getter = 'checked';
                        break;
                    case 'submit':
                    case 'button':
                        throw new Error('HTML input tag type invalid');
                    case 'text':
                    case 'number':
                        //TML5 input types stays the same
                        break;
                    case 'password':
                    case 'hidden': //prop.type is text
                    default:
                        //•color	•date	•datetime	•datetime-local	•email	•month	•number	•range	•search
                        //•tel	•time	•url	•week
                        this.$.type = 'text';
                }
                break;
            case 'textarea':
                this.$.type = 'text';
                this.$.editable = true;
                break;
            case 'select':
                this.$.htmlSelect = true;
                switch (this.html.type.toLowerCase()) {
                    case 'select-one':
                        this.$.getter = "selectedIndex"; //'<any>null';
                        break;
                    case 'select-multiple':
                        this.$.getter = "selectedOptions"; //'<any>null'
                        this.$.selectMultiple = true;
                        break;
                }
                this.$.type = "integer";
                //define properties for 'SELECT'
                let index = -1;
                this.$.selectCount = this.html.length;
                //later return an array for select multiple
                (0, dab_1.dP)(this, "index", {
                    get: () => index,
                    set(value) {
                        (value >= 0 && value < this.$.selectCount) && // this.options.length
                            ((index != -1) && (this.html.options[index].selected = !1),
                                this.html.options[index = value].selected = !0,
                                this.trigger());
                    }
                });
                (0, dab_1.dP)(this, "selectedOption", {
                    get: () => this.html.options[this.html.selectedIndex]
                });
                break;
            default:
                //later check this for all text HTMLElements
                this.$.getter = 'innerHTML';
        }
        ;
        //this's set only if it's an editable property
        this.react
            && this.html.addEventListener('change', this.trigger);
    }
    get type() { return this.$.type; }
    get html() { return this.$.html; }
    get editable() { return this.$.editable; }
    get tag() { return this.$.tag; }
    get nodeName() { return this.html.nodeName.toLowerCase(); }
    get react() { return this.editable || this.$.htmlSelect; }
    get value() {
        if (!this.react) {
            return this.$.value;
        }
        let val = this.html[this.$.getter]; //select.selectedOptions
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
            return [].map.call(val, (option) => option.value);
        }
        else
            return this.html.options[val].value;
    }
    set value(val) {
        if (!this.react) {
            this.$.value = val;
            //call onchange to get UI value
            let transfValue = this.onChange && this.onChange(val, 2, this, void 0);
            //write to DOM transformed value, if undefined write "val"
            this.html[this.$.getter] = (transfValue == undefined) ? val : transfValue;
            return;
        }
        if (!this.$.htmlSelect) {
            let valtype = (0, dab_1.typeOf)(val);
            if ((this.type == "text" && valtype == "string") ||
                (this.type == "boolean" && valtype == "boolean") ||
                (this.type == "integer" && (0, dab_1.isInt)(val)) ||
                (this.type == "number" && (0, dab_1.isNumeric)(val)))
                this.html[this.$.getter] = val;
        }
        else {
            if (this.$.selectMultiple) {
                let values = (0, dab_1.splat)(val).map((num) => num + '');
                [].forEach.call(this.html.options, (option) => {
                    (values.indexOf(option.value) >= 0) && (option.selected = true);
                });
            }
            else {
                if ((0, dab_1.isStr)(this.value)) {
                    val = [].findIndex.call(this.html.options, (option) => option.value == val);
                }
                this.html.selectedIndex = val | 0;
            }
        }
        this.trigger(null);
    }
    dispose() {
        this.react
            && this.html.removeEventListener('change', this.trigger);
    }
    trigger(e) {
        //when comming from UI, this is the DOM Element
        // 	otherwise it's the property
        let prop = this instanceof UIProp ? this : this.dab;
        if (!prop)
            return;
        prop.html.blur();
        prop.onChange && prop.onChange(prop.value, //this cache current value
        (e) ? 1 : 2, // 1 == 'ui' : 2 == 'prop'
        prop, //not needed, but just in case
        e //event if UI triggered
        );
    }
    /**
     * @description class property defaults. Only these keys are copied internally
     */
    defaults() {
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
    }
}
exports.UIProp = UIProp;
class PropContainer extends interfaces_1.Base {
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
    constructor(props) {
        super();
        (0, misc_1.each)(props, (options, key) => this.$._[key] = hook(this, key, options));
    }
    get props() { return this.$._; }
    get modified() { return this.$.modified; }
    set modified(value) { this.$.modified = value; }
    /**
     * @description class property defaults. Only these keys are copied internally
     */
    defaults() {
        return {
            _: {},
            modified: false
        };
    }
}
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
    (0, dab_1.dP)(prop, "value", {
        get() {
            return p.value;
        },
        set(value) {
            p.value = value;
            //trigger father's modified only if defined, defaults to "true"
            modified = true;
            onModify && (parent.$.modified = true);
        }
    });
    (0, dab_1.dP)(prop, "name", { get() { return name; } });
    (0, dab_1.dP)(prop, "modified", { get() { return modified; } });
    (0, dab_1.dP)(prop, "prop", { get() { return p; } });
    //shortcut returns the data of the property
    (0, dab_1.dP)(prop, "_", { get() { return p._; } });
    Object.freeze(prop);
    return prop;
}
