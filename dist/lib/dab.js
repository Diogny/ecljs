"use strict";
//still in progress...
Object.defineProperty(exports, "__esModule", { value: true });
exports.toBool = exports.selectMany = exports.createClass = exports.addClassX = exports.union = exports.unique = exports.range = exports.getParentAttr = exports.condClass = exports.toggleClass = exports.removeClass = exports.addClass = exports.hasClass = exports.aCld = exports.dP = exports.rEL = exports.aEL = exports.propDescriptor = exports.attr = exports.css = exports.defEnum = exports.clone = exports.obj = exports.pojo = exports.isElement = exports.inherit = exports.copy = exports.extend = exports.splat = exports.round = exports.clamp = exports.pInt = exports.isInt = exports.isNumeric = exports.isNum = exports.isArr = exports.isObj = exports.isStr = exports.dfnd = exports.isFn = exports.typeOf = exports.empty = exports.ts = exports.consts = void 0;
const c = {
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
const ts = (t) => ({}).toString.call(t);
exports.ts = ts;
//it can be extended later to array [] and object {}
const empty = (s) => typeof s == void 0 || !s || (isStr(s) && s.match(/^ *$/) !== null);
exports.empty = empty;
//returned values: array, date,	function, number, object, regexp, string, undefined  	global,	JSON, null
exports.typeOf = (o) => ts(o).slice(8, -1).toLowerCase();
//nullOrWhiteSpace(s) {
//	return !s || s.match(/^ *$/) !== null;
//},
exports.isFn = (f) => typeof f === c.fn;
//defined			undefined === void 0
const dfnd = (t) => t !== void 0 && t !== null;
exports.dfnd = dfnd;
const isStr = (s) => typeof s === c.s;
exports.isStr = isStr;
//true for Array, pojo retruns true only for a plain old object {}
exports.isObj = (t) => typeof t === c.o;
const isArr = (t) => Array.isArray(t); // typeOf(t) === c.a;
exports.isArr = isArr;
//has to be a number ("1") == false
exports.isNum = (n) => typeof n === c.n;
// ("1") == true
exports.isNumeric = (n) => isNaN(n) ? !1 : (n = parseInt(n), (0 | n) === n);
//return (typeof x === dab.n) && (x % 1 === 0);
exports.isInt = (n) => (parseFloat(n) == parseInt(n)) && !isNaN(n);
//http://speakingjs.com/es5/ch11.html#converting_to_integer
exports.pInt = (s, mag) => parseInt(s, mag || 10);
// clamp(value, min, max) - limits value to the range min..max
exports.clamp = (v, min, max) => (v <= min) ? min : (v >= max) ? max : v;
exports.round = (v, decimals) => {
    //https://expertcodeblog.wordpress.com/2018/02/12/typescript-javascript-round-number-by-decimal-pecision/
    return (decimals = decimals | 0, Number(Math.round(Number(v + "e" + decimals)) + "e-" + decimals));
}; //force toArray
exports.splat = (o) => isArr(o) ? o : (dfnd(o) ? [o] : []);
//copy all properties in src to obj, and returns obj
exports.extend = (obj, src) => {
    //!obj && (obj = {});
    //const returnedTarget = Object.assign(target, source); doesn't throw error if source is undefined
    //		but target has to be an object
    pojo(src) && Object.keys(src).forEach((key) => { obj[key] = src[key]; });
    return obj;
};
//copy properties in src that exists only in obj, and returns obj
exports.copy = (obj, src) => {
    pojo(src) && Object.keys(obj).forEach((key) => {
        let k = src[key];
        dfnd(k) && (obj[key] = k);
    });
    return obj;
};
exports.inherit = (parent, child) => {
    child.prototype = Object.create(parent.prototype);
    child.prototype.constructor = child;
};
/**
 * @description returns true if an element if an HTML or SVG DOM element
 * @param e {any} an element
 */
exports.isElement = (e) => e instanceof Element || e instanceof HTMLDocument;
/* this generates a function "inherit" and later assigns it to the namespace "dab"
    export function inherit(parent: any, child: any) {
        child.prototype = Object.create(parent.prototype);
        child.prototype.constructor = child;
    }
     */
const pojo = (arg) => {
    if (arg == null || typeof arg !== 'object') {
        return false;
    }
    const proto = Object.getPrototypeOf(arg);
    // Prototype may be null if you used `Object.create(null)`
    // Checking `proto`'s constructor is safe because `getPrototypeOf()`
    // explicitly crosses the boundary from object data to object metadata
    return !proto || proto.constructor.name === 'Object';
    //Object.getPrototypeOf([]).constructor.name == "Array"
    //Object.getPrototypeOf({}).constructor.name == "Object"
    //Object.getPrototypeOf(Object.create(null)) == null
};
exports.pojo = pojo;
const obj = (o) => {
    if (!pojo(o)) {
        return o;
    }
    let result = Object.create(null);
    for (let k in o)
        if (!o.hasOwnProperty || o.hasOwnProperty(k)) {
            let prop = o[k];
            result[k] = pojo(prop) ? obj(prop) : prop;
        }
    return result;
};
exports.obj = obj;
exports.clone = (o) => JSON.parse(JSON.stringify(o));
exports.defEnum = (e) => {
    for (let key in e) { //let item = e[key];
        e[e[key]] = key;
    }
    return e;
};
exports.css = (el, styles) => {
    if (isStr(styles))
        return el.style[styles];
    for (let prop in styles)
        el.style[prop] = styles[prop];
    return el;
};
exports.attr = function (el, attrs) {
    if (isStr(attrs))
        return el.getAttribute(attrs);
    for (let attr in attrs)
        el.setAttribute(attr, attrs[attr]);
    return el;
};
exports.propDescriptor = function (obj, prop) {
    //Object.getOwnPropertyDescriptor(obj, prop);
    let desc;
    do {
        desc = Object.getOwnPropertyDescriptor(obj, prop);
    } while (!desc && (obj = Object.getPrototypeOf(obj)));
    return desc;
};
exports.aEL = (el, eventName, fn, b) => el.addEventListener(eventName, fn, b);
exports.rEL = (el, eventName, fn, b) => el.removeEventListener(eventName, fn, b);
exports.dP = (obj, propName, attrs) => Object.defineProperty(obj, propName, attrs);
exports.aCld = (parent, child) => parent.appendChild(child);
exports.hasClass = (el, className) => el.classList.contains(className);
//className cannot contain spaces
const addClass = (el, className) => el.classList.add(className);
exports.addClass = addClass;
const removeClass = (el, className) => el.classList.remove(className);
exports.removeClass = removeClass;
exports.toggleClass = (el, className) => el.classList.toggle(className);
//https://www.kirupa.com/html5/using_the_classlist_api.htm
// d.addmany
// [b] true -> addClass, [b] false -> removeClass
exports.condClass = (el, className, b) => (b && (addClass(el, className), 1)) || removeClass(el, className);
//https://plainjs.com/javascript/traversing/match-element-selector-52/
//https://plainjs.com/javascript/traversing/get-siblings-of-an-element-40/
exports.getParentAttr = function (p, attr) {
    while (p && !p.hasAttribute(attr))
        p = p.parentElement;
    return p;
};
exports.range = (s, e) => Array.from('x'.repeat(e - s), (_, i) => s + i);
//Sets
const unique = (x) => x.filter((elem, index) => x.indexOf(elem) === index);
exports.unique = unique;
const union = (x, y) => unique(x.concat(y));
exports.union = union;
exports.addClassX = (el, className) => {
    el.classList.add(...(className || "").split(' ').filter((v) => !empty(v)));
    return el;
};
//this.win.classList.add(...(this.settings.class || "").split(' '));
exports.createClass = (baseClass, newClass) => {
    let split = (s) => s.split(' '), baseArr = split(baseClass || ""), newArr = split(newClass || "");
    return union(baseArr, newArr).join(' ');
};
exports.selectMany = (input, selectListFn) => input.reduce((out, inx) => {
    out.push(...selectListFn(inx));
    return out;
}, new Array());
var a = {
    'true': true,
    'false': false,
    'undefined': false,
    'null': false,
    '1': true,
    '0': false
};
exports.toBool = (val) => a[val];
