//still in progress...

const c: any = {
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

export { c as consts };

export const ts = (t: any) => ({}).toString.call(t);

//it can be extended later to array [] and object {}
export const empty = (s: any): boolean => typeof s == void 0 || !s || (isStr(s) && s.match(/^ *$/) !== null);

//returned values: array, date,	function, number, object, regexp, string, undefined  	global,	JSON, null
export const typeOf = (o: any) => ts(o).slice(8, -1).toLowerCase();
//nullOrWhiteSpace(s) {
//	return !s || s.match(/^ *$/) !== null;
//},

export const isFn = (f: any) => typeof f === c.fn;

//defined			undefined === void 0
export const dfnd = (t: any) => t !== void 0 && t !== null;

export const isStr = (s: any) => typeof s === c.s;

//true for Array, pojo retruns true only for a plain old object {}
export const isObj = (t: any) => typeof t === c.o;

export const isArr = (t: any) => Array.isArray(t); // typeOf(t) === c.a;

//has to be a number ("1") == false
export const isNum = (n: any) => typeof n === c.n;

// ("1") == true
export const isNumeric = (n: any) => isNaN(n) ? !1 : (n = parseInt(n), (0 | n) === n);

//return (typeof x === dab.n) && (x % 1 === 0);
export const isInt = (n: any) => (parseFloat(n) == parseInt(n)) && !isNaN(n);
//http://speakingjs.com/es5/ch11.html#converting_to_integer

export const pInt = (s: string, mag?: number) => parseInt(s, mag || 10);

// clamp(value, min, max) - limits value to the range min..max
export const clamp = (v: number, min: number, max: number) => (v <= min) ? min : (v >= max) ? max : v;

export const round = (v: number, decimals: number) => {
	//https://expertcodeblog.wordpress.com/2018/02/12/typescript-javascript-round-number-by-decimal-pecision/
	return (decimals = decimals | 0, Number(Math.round(Number(v + "e" + decimals)) + "e-" + decimals));
} //force toArray

export const splat = <T>(o: any): T[] => isArr(o) ? o : (dfnd(o) ? [o] : []);

//copy all properties in src to obj, and returns obj
export const extend = (obj: { [id: string]: any }, src: { [id: string]: any }) => { //no support for IE 8 https://plainjs.com/javascript/utilities/merge-two-javascript-objects-19/
	//!obj && (obj = {});
	//const returnedTarget = Object.assign(target, source); doesn't throw error if source is undefined
	//		but target has to be an object
	pojo(src) && Object.keys(src).forEach((key) => { obj[key] = src[key]; });
	return obj;
}

//copy properties in src that exists only in obj, and returns obj
export const copy = (obj: { [id: string]: any }, src: { [id: string]: any }) => {
	pojo(src) && Object.keys(obj).forEach((key) => {
		let
			k = src[key];
		dfnd(k) && (obj[key] = k)
	});
	return obj
}

export const inherit = (parent: any, child: any) => {
	child.prototype = Object.create(parent.prototype);
	child.prototype.constructor = child;
}

/**
 * @description returns true if an element if an HTML or SVG DOM element
 * @param e {any} an element
 */
export const isDOM = (e: any) => e instanceof window.HTMLElement || e instanceof window.HTMLDocument;

export const pojo = (arg: any): boolean => {	// plainObj   Plain Old JavaScript Object (POJO)		{}
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
}

export const obj = (o: any) => {			//deep copy
	if (!pojo(o)) {
		return o;
	}
	let
		result = Object.create(null);
	for (let k in o)
		if (!o.hasOwnProperty || o.hasOwnProperty(k)) {
			let
				prop = o[k];
			result[k] = pojo(prop) ? obj(prop) : prop;
		}
	return result;
}

export const clone = <T>(o: T): T => <T>JSON.parse(JSON.stringify(o));

export const defEnum = (e: any) => {
	for (let key in e) {			//let item = e[key];
		e[e[key]] = key;
	}
	return e;
}

export const css = (el: any, styles: any) => {//css(el, { background: 'green', display: 'none', 'border-radius': '5px' });
	if (isStr(styles))
		return el.style[styles];
	for (let prop in styles)
		el.style[prop] = styles[prop];
	return el;
}

export const attr = function (el: any, attrs: any) {
	if (isStr(attrs))
		return el.getAttribute(attrs);
	for (let attr in attrs)
		el.setAttribute(attr, attrs[attr]);
	return el;
}

/**
 * @description adds an event listener to an element
 * @param el element
 * @param eventName event name
 * @param fn 
 * @param b 
 */
export const aEL = (el: HTMLElement, eventName: string, fn: Function, b?: boolean | AddEventListenerOptions | undefined): void => el.addEventListener(<any>eventName, <any>fn, b);

/**
 * @description removes an event listener to an element
 * @param el element
 * @param eventName event name
 * @param fn 
 * @param b 
 */
export const rEL = (el: HTMLElement, eventName: string, fn: Function, b?: boolean | AddEventListenerOptions | undefined): void => el.removeEventListener(<any>eventName, <any>fn, b);

/**
 * @description defines a new object property
 * @param obj object
 * @param propName property name
 * @param attrs attributes
 */
export const dP = (obj: any, propName: string, attrs: object) => Object.defineProperty(obj, propName, attrs);

/**
 * @description appends a child element to it's new parent
 * @param parent parent element
 * @param child child element
 */
export const aChld = (parent: any, child: any) => parent.appendChild(child);

/**
 * @description test for class
 * @param el Element
 * @param className className cannot contain spaces
 * @returns true if present, false otherwise
 */
export const hCl = (el: Element, className: string): boolean => el.classList.contains(className);

/**
 * @description adds a class to an Element
 * @param el Element
 * @param className className cannot contain spaces
 */
export const aCl = (el: Element, className: string) => el.classList.add(className);

/**
 * @description removes a class from an Element
 * @param el Element
 * @param className className cannot contain spaces
 */
export const rCl = (el: Element, className: string) => el.classList.remove(className);

/**
 * @description toggles a class from an Element
 * @param el Element
 * @param className className cannot contain spaces
 * @param force undefined is toggle, true is add, false is remove
 * @returns true if present, false if not
 */
export const tCl = (el: Element, className: string, force?: boolean): boolean => el.classList.toggle(className, force);

//https://plainjs.com/javascript/traversing/match-element-selector-52/
//https://plainjs.com/javascript/traversing/get-siblings-of-an-element-40/

export const range = (s: number, e: number) => Array.from('x'.repeat(e - s), (_, i) => s + i);

//Sets
export const unique = (x: any[]): any[] => x.filter((elem, index) => x.indexOf(elem) === index);

export const union = (x: any[], y: any[]): any[] => unique(x.concat(y));

export const aClx = (el: Element, className: string): Element => {
	el.classList.add(...(className || "").split(' ').filter((v: string) => !empty(v)))
	return el
}

export const selectMany = <TIn, TOut>(input: TIn[], selectListFn: (t: TIn) => TOut[]): TOut[] =>
	input.reduce((out, inx) => {
		out.push(...selectListFn(inx));
		return out;
	}, new Array<TOut>());

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

export const toBool = (val: any): boolean => a[val] || false;

export const parse = (s: string, l: number): number[] | undefined => {
	let
		n: number,
		nans = false,
		numbers = s.split(',').map(str => (n = parseFloat(str), isNaN(n) && (nans = true), n));
	return (nans || numbers.length != l) ? void 0 : numbers
}