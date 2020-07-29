//... still in progress ...
import ajaxp from './ajaxp';
import { isObj, isFn, attr, aEL, consts as _, pojo } from './dab';
function scriptContent(key, text) {
    let regexSingle = /<script[^\>]*>([\s\S]*?)<\/script>/gi, //regex are not reusable
    match = regexSingle.exec(text);
    //window[key] = text;
    return match ? match[1].replace(/\r|\n/g, "").trim() : "";
}
;
//ajaxp.get(`${base}api/1.0/templates/circuits/stockSymbol,gate_card`, { 'responseType': 'json' })
export const templatesUrl = (url, obj) => ajaxp.get(url, obj || { 'responseType': 'json' })
    .then((data) => {
    let regex = /<script.*?id\s*=\s*['"]([^'|^"]*)['"].*?>([\s\S]*?)<\/script>/gmi, templates = {}, match;
    if (isObj(data)) {
        each(data.result, (d, k) => {
            templates[k] = scriptContent(k, d.text);
        });
    }
    else {
        while ((match = regex.exec(data)))
            // full match is in match[0], whereas captured groups are in ...[1], ...[2], etc.
            templates[match[1]] = match[2].replace(/\r|\n/g, "").trim();
    }
    //return scriptContent(data.matches['stockSymbol'].text);		
    return templates;
});
export const templatesDOM = (query) => {
    return new Promise(function (resolve, reject) {
        //query:string   id0|id1|id[n]
        let templates = {}, count = 0, idList = Array.isArray(query) ? query : query.split('|');
        idList.forEach((id) => {
            let tmpl = qS(`#${id}`), src = tmpl ? tmpl.innerHTML.replace(/\r|\n/g, "").trim() : undefined;
            tmpl && (count++, templates[id] = src);
        });
        resolve(templates);
    });
};
//used for string & numbers
export const pad = (t, e, ch) => new Array(Math.max(0, (e || 2) + 1 - String(t).length)).join(ch ? ch : '0') + t;
export const fillChar = (ch, len) => new Array(len).join(ch);
export const padStr = (s, width) => new Array(Math.max(0, width - s.length)).join(' ') + s;
export const formatNumber = (n, width) => padStr(n + "", width);
export const tag = (tagName, id, nsAttrs) => (id && (nsAttrs.id = id),
    attr(document.createElementNS(_.svgNs, tagName), nsAttrs));
export const svg = (html) => {
    let template = document.createElementNS(_.svgNs, "template");
    template.innerHTML = html;
    return template.children[0];
};
export const html = (html) => {
    let template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstChild;
};
export const each = (obj, fn) => {
    if (!isFn(fn) || !obj)
        return;
    let ndx = 0;
    for (let key in obj)
        if (!obj.hasOwnProperty || obj.hasOwnProperty(key))
            fn(obj[key], key, ndx++); // (value, key, index)
};
export const map = (obj, fn) => {
    let arr = [];
    each(obj, (value, key, ndx) => {
        arr.push(fn(value, key, ndx));
    });
    return arr;
};
export const filter = (obj, fn) => {
    let o = {};
    each(obj, (value, key, ndx) => {
        fn(value, key, ndx) && (o[key] = value);
    });
    return o;
};
/**
 * @description
 * @param obj an object to filter
 * @param fn if it returns true array[]= value (key is lost), if object array[] = object, otherwise discarded
 */
export const filterArray = (obj, fn) => {
    let o = [];
    each(obj, (value, key, ndx) => {
        let res = fn(value, key, ndx);
        if (res === true)
            o.push(value);
        else if (pojo(res))
            o.push(res);
    });
    return o;
};
export const prop = function (o, path, value) {
    let r = path.split('.').map(s => s.trim()), last = r.pop(), result = void 0;
    for (let i = 0; !!o && i < r.length; i++) {
        o = o[r[i]];
    }
    result = o && last && o[last];
    if (value == undefined) {
        return result;
    }
    else {
        return (result != undefined) && (o[last] = value, true);
    }
};
export const ready = (fn) => {
    if (!isFn(fn)) {
        return !1;
    }
    if (document.readyState != "loading")
        return (fn(), !0);
    else if (document["addEventListener"])
        aEL(document, "DOMContentLoaded", fn, false);
    else
        document.attachEvent("onreadystatechange", () => {
            if (document.readyState == "complete")
                fn();
        });
    return !0;
};
const qS = (s) => document.querySelector(s);
export { qS };
export const qSA = (s) => document.querySelectorAll(s);
export const gEId = (id) => document.getElementById(id);
export const basePath = () => {
    let meta = qS('meta[name="base"]');
    return meta ? meta.getAttribute('content') : "";
};
export const matrix = (rows, cols, filler) => Array.from({ length: rows }, () => new Array(cols).fill(filler));
