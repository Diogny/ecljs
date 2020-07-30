"use strict";
//... still in progress ...
Object.defineProperty(exports, "__esModule", { value: true });
exports.matrix = exports.basePath = exports.gEId = exports.qSA = exports.qS = exports.ready = exports.prop = exports.filterArray = exports.filter = exports.map = exports.each = exports.html = exports.svg = exports.tag = exports.formatNumber = exports.padStr = exports.fillChar = exports.pad = exports.templatesDOM = exports.templatesUrl = void 0;
const tslib_1 = require("tslib");
const ajaxp_1 = tslib_1.__importDefault(require("./ajaxp"));
const dab_1 = require("./dab");
function scriptContent(key, text) {
    let regexSingle = /<script[^\>]*>([\s\S]*?)<\/script>/gi, //regex are not reusable
    match = regexSingle.exec(text);
    //window[key] = text;
    return match ? match[1].replace(/\r|\n/g, "").trim() : "";
}
;
//ajaxp.get(`${base}api/1.0/templates/circuits/stockSymbol,gate_card`, { 'responseType': 'json' })
exports.templatesUrl = (url, obj) => ajaxp_1.default.get(url, obj || { 'responseType': 'json' })
    .then((data) => {
    let regex = /<script.*?id\s*=\s*['"]([^'|^"]*)['"].*?>([\s\S]*?)<\/script>/gmi, templates = {}, match;
    if (dab_1.isObj(data)) {
        exports.each(data.result, (d, k) => {
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
exports.templatesDOM = (query) => {
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
exports.pad = (t, e, ch) => new Array(Math.max(0, (e || 2) + 1 - String(t).length)).join(ch ? ch : '0') + t;
exports.fillChar = (ch, len) => new Array(len).join(ch);
exports.padStr = (s, width) => new Array(Math.max(0, width - s.length)).join(' ') + s;
exports.formatNumber = (n, width) => exports.padStr(n + "", width);
exports.tag = (tagName, id, nsAttrs) => (id && (nsAttrs.id = id),
    dab_1.attr(document.createElementNS(dab_1.consts.svgNs, tagName), nsAttrs));
exports.svg = (html) => {
    let template = document.createElementNS(dab_1.consts.svgNs, "template");
    template.innerHTML = html;
    return template.children[0];
};
exports.html = (html) => {
    let template = document.createElement("template");
    template.innerHTML = html;
    return template.content.firstChild;
};
exports.each = (obj, fn) => {
    if (!dab_1.isFn(fn) || !obj)
        return;
    let ndx = 0;
    for (let key in obj)
        if (!obj.hasOwnProperty || obj.hasOwnProperty(key))
            fn(obj[key], key, ndx++); // (value, key, index)
};
exports.map = (obj, fn) => {
    let arr = [];
    exports.each(obj, (value, key, ndx) => {
        arr.push(fn(value, key, ndx));
    });
    return arr;
};
exports.filter = (obj, fn) => {
    let o = {};
    exports.each(obj, (value, key, ndx) => {
        fn(value, key, ndx) && (o[key] = value);
    });
    return o;
};
/**
 * @description
 * @param obj an object to filter
 * @param fn if it returns true array[]= value (key is lost), if object array[] = object, otherwise discarded
 */
exports.filterArray = (obj, fn) => {
    let o = [];
    exports.each(obj, (value, key, ndx) => {
        let res = fn(value, key, ndx);
        if (res === true)
            o.push(value);
        else if (dab_1.pojo(res))
            o.push(res);
    });
    return o;
};
exports.prop = function (o, path, value) {
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
exports.ready = (fn) => {
    if (!dab_1.isFn(fn)) {
        return !1;
    }
    if (document.readyState != "loading")
        return (fn(), !0);
    else if (document["addEventListener"])
        dab_1.aEL(document, "DOMContentLoaded", fn, false);
    else
        document.attachEvent("onreadystatechange", () => {
            if (document.readyState == "complete")
                fn();
        });
    return !0;
};
const qS = (s) => document.querySelector(s);
exports.qS = qS;
exports.qSA = (s) => document.querySelectorAll(s);
exports.gEId = (id) => document.getElementById(id);
exports.basePath = () => {
    let meta = qS('meta[name="base"]');
    return meta ? meta.getAttribute('content') : "";
};
exports.matrix = (rows, cols, filler) => Array.from({ length: rows }, () => new Array(cols).fill(filler));
