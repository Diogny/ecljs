"use strict";
//still in progress...
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.toBool = exports.selectMany = exports.aClx = exports.union = exports.unique = exports.range = exports.tCl = exports.rCl = exports.aCl = exports.hCl = exports.aChld = exports.dP = exports.rEL = exports.aEL = exports.attr = exports.css = exports.defEnum = exports.clone = exports.obj = exports.pojo = exports.isDOM = exports.inherit = exports.copy = exports.extend = exports.splat = exports.round = exports.clamp = exports.pInt = exports.isInt = exports.isNumeric = exports.isNum = exports.isArr = exports.isObj = exports.isStr = exports.dfnd = exports.isFn = exports.typeOf = exports.empty = exports.ts = exports.consts = void 0;
var tslib_1 = require("tslib");
var c = {
    s: "string",
    o: "object",
    b: "boolean",
    i: "integer",
    n: "number",
    a: "array",
    fn: "function",
    sp: "super",
    c: "color",
    t: "type",
    d: "defaut",
    u: "undefined",
    v: "value",
    svgNs: "http://www.w3.org/2000/svg"
};
exports.consts = c;
exports.ts = function (t) { return ({}).toString.call(t); };
//it can be extended later to array [] and object {}
exports.empty = function (s) { return typeof s == void 0 || !s || (exports.isStr(s) && s.match(/^ *$/) !== null); };
//returned values: array, date,	function, number, object, regexp, string, undefined  	global,	JSON, null
exports.typeOf = function (o) { return exports.ts(o).slice(8, -1).toLowerCase(); };
//nullOrWhiteSpace(s) {
//	return !s || s.match(/^ *$/) !== null;
//},
exports.isFn = function (f) { return typeof f === c.fn; };
//defined			undefined === void 0
exports.dfnd = function (t) { return t !== void 0 && t !== null; };
exports.isStr = function (s) { return typeof s === c.s; };
//true for Array, pojo retruns true only for a plain old object {}
exports.isObj = function (t) { return typeof t === c.o; };
exports.isArr = function (t) { return Array.isArray(t); }; // typeOf(t) === c.a;
//has to be a number ("1") == false
exports.isNum = function (n) { return typeof n === c.n; };
// ("1") == true
exports.isNumeric = function (n) { return isNaN(n) ? !1 : (n = parseInt(n), (0 | n) === n); };
//return (typeof x === dab.n) && (x % 1 === 0);
exports.isInt = function (n) { return (parseFloat(n) == parseInt(n)) && !isNaN(n); };
//http://speakingjs.com/es5/ch11.html#converting_to_integer
exports.pInt = function (s, mag) { return parseInt(s, mag || 10); };
// clamp(value, min, max) - limits value to the range min..max
exports.clamp = function (v, min, max) { return (v <= min) ? min : (v >= max) ? max : v; };
exports.round = function (v, decimals) {
    //https://expertcodeblog.wordpress.com/2018/02/12/typescript-javascript-round-number-by-decimal-pecision/
    return (decimals = decimals | 0, Number(Math.round(Number(v + "e" + decimals)) + "e-" + decimals));
}; //force toArray
exports.splat = function (o) { return exports.isArr(o) ? o : (exports.dfnd(o) ? [o] : []); };
//copy all properties in src to obj, and returns obj
exports.extend = function (obj, src) {
    //!obj && (obj = {});
    //const returnedTarget = Object.assign(target, source); doesn't throw error if source is undefined
    //		but target has to be an object
    exports.pojo(src) && Object.keys(src).forEach(function (key) { obj[key] = src[key]; });
    return obj;
};
//copy properties in src that exists only in obj, and returns obj
exports.copy = function (obj, src) {
    exports.pojo(src) && Object.keys(obj).forEach(function (key) {
        var k = src[key];
        exports.dfnd(k) && (obj[key] = k);
    });
    return obj;
};
exports.inherit = function (parent, child) {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
};
/**
 * @description returns true if an element if an HTML or SVG DOM element
 * @param e {any} an element
 */
exports.isDOM = function (e) { return e instanceof window.HTMLElement || e instanceof window.HTMLDocument; };
exports.pojo = function (arg) {
    if (arg == null || typeof arg !== 'object') {
        return false;
    }
    var proto = Object.getPrototypeOf(arg);
    // Prototype may be null if you used `Object.create(null)`
    // Checking `proto`'s constructor is safe because `getPrototypeOf()`
    // explicitly crosses the boundary from object data to object metadata
    return !proto || proto.constructor.name === 'Object';
    //Object.getPrototypeOf([]).constructor.name == "Array"
    //Object.getPrototypeOf({}).constructor.name == "Object"
    //Object.getPrototypeOf(Object.create(null)) == null
};
exports.obj = function (o) {
    if (!exports.pojo(o)) {
        return o;
    }
    var result = Object.create(null);
    for (var k in o)
        if (!o.hasOwnProperty || o.hasOwnProperty(k)) {
            var prop = o[k];
            result[k] = exports.pojo(prop) ? exports.obj(prop) : prop;
        }
    return result;
};
exports.clone = function (o) { return JSON.parse(JSON.stringify(o)); };
exports.defEnum = function (e) {
    for (var key in e) { //let item = e[key];
        e[e[key]] = key;
    }
    return e;
};
exports.css = function (el, styles) {
    if (exports.isStr(styles))
        return el.style[styles];
    for (var prop in styles)
        el.style[prop] = styles[prop];
    return el;
};
exports.attr = function (el, attrs) {
    if (exports.isStr(attrs))
        return el.getAttribute(attrs);
    for (var attr_1 in attrs)
        el.setAttribute(attr_1, attrs[attr_1]);
    return el;
};
/**
 * @description adds an event listener to an element
 * @param el element
 * @param eventName event name
 * @param fn
 * @param b
 */
exports.aEL = function (el, eventName, fn, b) { return el.addEventListener(eventName, fn, b); };
/**
 * @description removes an event listener to an element
 * @param el element
 * @param eventName event name
 * @param fn
 * @param b
 */
exports.rEL = function (el, eventName, fn, b) { return el.removeEventListener(eventName, fn, b); };
/**
 * @description defines a new object property
 * @param obj object
 * @param propName property name
 * @param attrs attributes
 */
exports.dP = function (obj, propName, attrs) { return Object.defineProperty(obj, propName, attrs); };
/**
 * @description appends a child element to it's new parent
 * @param parent parent element
 * @param child child element
 */
exports.aChld = function (parent, child) { return parent.appendChild(child); };
/**
 * @description test for class
 * @param el Element
 * @param className className cannot contain spaces
 * @returns true if present, false otherwise
 */
exports.hCl = function (el, className) { return el.classList.contains(className); };
/**
 * @description adds a class to an Element
 * @param el Element
 * @param className className cannot contain spaces
 */
exports.aCl = function (el, className) { return el.classList.add(className); };
/**
 * @description removes a class from an Element
 * @param el Element
 * @param className className cannot contain spaces
 */
exports.rCl = function (el, className) { return el.classList.remove(className); };
/**
 * @description toggles a class from an Element
 * @param el Element
 * @param className className cannot contain spaces
 * @param force undefined is toggle, true is add, false is remove
 * @returns true if present, false if not
 */
exports.tCl = function (el, className, force) { return el.classList.toggle(className, force); };
//https://plainjs.com/javascript/traversing/match-element-selector-52/
//https://plainjs.com/javascript/traversing/get-siblings-of-an-element-40/
exports.range = function (s, e) { return Array.from('x'.repeat(e - s), function (_, i) { return s + i; }); };
//Sets
exports.unique = function (x) { return x.filter(function (elem, index) { return x.indexOf(elem) === index; }); };
exports.union = function (x, y) { return exports.unique(x.concat(y)); };
exports.aClx = function (el, className) {
    var _a;
    (_a = el.classList).add.apply(_a, tslib_1.__spread((className || "").split(' ').filter(function (v) { return !exports.empty(v); })));
    return el;
};
exports.selectMany = function (input, selectListFn) {
    return input.reduce(function (out, inx) {
        out.push.apply(out, tslib_1.__spread(selectListFn(inx)));
        return out;
    }, new Array());
};
var a = {
    'True': true,
    'true': true,
    'false': false,
    'False': false,
    'undefined': false,
    'null': false,
    '1': true,
    '0': false
};
exports.toBool = function (val) { return a[val] || false; };
exports.parse = function (s, l) {
    var n, nans = false, numbers = s.split(',').map(function (str) { return (n = parseFloat(str), isNaN(n) && (nans = true), n); });
    return (nans || numbers.length != l) ? void 0 : numbers;
};
