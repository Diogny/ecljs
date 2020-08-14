import { isFn, attr, aEL, consts as _, pojo } from './dab';

export const DOMTemplates = (): { [key: string]: any } => {
	let
		templates: { [key: string]: any } = {};
	Array.from(qSA('script[data-tmpl]')).forEach(((scr: HTMLScriptElement) => {
		let
			id = <string>scr.getAttribute('data-tmpl'),
			src = scr.innerHTML.replace("<![CDATA[", "").replace("]]>", "").replace(/[\r\n\t]/g, "").trim();
		templates[id] = src
	}));
	return templates;
}

//used for string & numbers
export const pad = (t: string, e: number, ch?: any) =>
	new Array(Math.max(0, (e || 2) + 1 - String(t).length)).join(ch ? ch : '0') + t;

export const fillChar = (ch: string, len: number) => new Array(len).join(ch);

export const padStr = (s: string, width: number) => new Array(Math.max(0, width - s.length)).join(' ') + s;

export const formatNumber = (n: number, width: number) => padStr(n + "", width);

export const tag = (tagName: string, id: string, nsAttrs: any): SVGElement => (id && (nsAttrs.id = id),
	attr(document.createElementNS(_.svgNs, tagName), nsAttrs));

export const svg = (html: string): Element => {
	let template = document.createElementNS(_.svgNs, "template");
	template.innerHTML = html;
	return template.children[0];
};

export const html = (html: string): ChildNode => {
	let template = document.createElement("template");
	template.innerHTML = html;
	return <any>template.content.firstChild;
};

export const each = (obj: any, fn: (value: any, key: string, ndx: number) => void) => {		//for objects
	if (!isFn(fn) || !obj)
		return;
	let ndx = 0;
	for (let key in obj)
		if (!obj.hasOwnProperty || obj.hasOwnProperty(key))
			fn(obj[key], key, ndx++);	// (value, key, index)
};

export const map = (obj: any, fn: (value: any, key: string, ndx: number) => any) => {		//for objects
	let arr: any[] = [];
	each(obj, (value: any, key: string, ndx: number) => {
		arr.push(fn(value, key, ndx));
	});
	return arr;
};

export const filter = (obj: any, fn: (value: any, key: string, ndx: number) => any) => {		//for objects, returns an object with key=>value
	let o: any = {};
	each(obj, (value: any, key: string, ndx: number) => {
		fn(value, key, ndx) && (o[key] = value);
	});
	return o;
};

/**
 * @description
 * @param obj an object to filter
 * @param fn if it returns true array[]= value (key is lost), if object array[] = object, otherwise discarded
 */
export const filterArray = (obj: any, fn: (value: any, key: string, ndx: number) => any) => {
	let o: any[] = [];
	each(obj, (value: any, key: string, ndx: number) => {
		let
			res = fn(value, key, ndx);
		if (res === true)
			o.push(value)
		else if (pojo(res))
			o.push(res);
	});
	return o;
};

export const prop = function (o: any, path: string, value?: any) {
	let
		r = path.split('.').map(s => s.trim()),
		last = <string>r.pop(),
		result = <any>void 0;
	for (let i = 0; !!o && i < r.length; i++) {
		o = o[r[i]]
	}
	result = o && o[last];
	return value ? ((result != undefined) && (o[<string>last] = value, true)) : result
};

export const ready = (fn: Function) => { //https://plainjs.com/javascript/events/running-code-when-the-document-is-ready-15/
	if (!isFn(fn)) {
		return !1;
	}
	if (document.readyState != "loading")
		return (fn(), !0);
	else if (document["addEventListener"])
		aEL(<any>document, "DOMContentLoaded", fn, false);
	else
		(<any>document).attachEvent("onreadystatechange", () => {
			if (document.readyState == "complete")
				fn();
		});
	return !0;
};

/**
 * @description document.querySelector shortcut
 * @param s query
 */
export const qS = (s: string): HTMLElement => <HTMLElement>document.querySelector(s);

/**
 * @description document.querySelectorAll shortcut
 * @param s query
 */
export const qSA = (s: string) => document.querySelectorAll(s);

/**
 * @description document.getElementById shortcut
 * @param s #id
 */
export const gEId = (id: string) => document.getElementById(id);

export const basePath = () => {
	let
		meta = qS('meta[name="base"]');
	return meta ? meta.getAttribute('content') : "";
}

/**
 * @description creates a NxN matrix
 * @param rows amount of rows
 * @param cols amount of columns
 * @param filler cell filler
 */
export const matrix = <T>(rows: number, cols: number, filler: T): T[][] =>
	Array.from({ length: rows }, () => new Array(cols).fill(filler));

/**
 * @description converts a web css property to camel case
 * @param str font-size  -webkit-box-shadow
 * @@returns fontSize  WebkitBoxShadow
 */
export const camel = (str: string) => str.replace(/\-([a-z])/gi, (match, group) => group.toUpperCase())

/**
 * @description removes camel of a web css property
 * @param str fontSize  WebkitBoxShadow
 * @returns font-size  -webkit-box-shadow
 */
export const uncamel = (str: string) => str.replace(/([A-Z])/g, (match, group) => '-' + group.toLowerCase())
