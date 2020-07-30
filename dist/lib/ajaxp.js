"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ajaxp {
    static x() { return window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP'); }
    static query(data, ask) {
        let query = [];
        for (let key in data) {
            query.push(encodeURIComponent(key) + "=" + encodeURIComponent(data[key]));
        }
        return ((ask && query.length) ? "?" : "") + query.join("&");
    }
    static update(io, obj) {
        for (let p in io) {
            obj[p] = obj[p] || io[p];
        }
        return obj;
    }
    static send(url, ox) {
        return new Promise(function (resolve, reject) {
            let x = ajaxp.x();
            ox = ajaxp.update(ajaxp.xobj, ox);
            x.open(ox.method, url, true);
            x[ajaxp.rt] = ox.responseType;
            x.onreadystatechange = function () {
                let DONE = 4, // readyState 4 means the request is done.
                OK = 200, // status 200 is a successful return.
                NOT_MODIFIED = 304;
                if (x.readyState == DONE) {
                    let isJson = x[ajaxp.rt] && (x[ajaxp.rt] == "json");
                    if (x.status === OK || x.status === NOT_MODIFIED) {
                        resolve(isJson ? x.response : x.responseText);
                    }
                    else {
                        reject({ status: x.status, d: x.response, xhr: x });
                    }
                }
            };
            if (ox.method == ajaxp.sPost) {
                x.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            }
            x.onerror = function (e) {
                reject(e);
            };
            try {
                x.send(ox.data);
            }
            catch (e) {
                reject({ status: x.status, statusText: x.statusText, xhr: x });
            }
        });
    }
    static get(url, ox) {
        return (ox = ox || {}, ox.method = ajaxp.sGet, url += ajaxp.query(ox.data, true), ox.data = void 0, ajaxp.send(url, ox));
    }
    static post(url, ox) {
        return (ox = ox || {}, ox.method = ajaxp.sPost, ox.data = ajaxp.query(ox.data, false), ajaxp.send(url, ox));
    }
}
exports.default = ajaxp;
ajaxp.sGet = "GET";
ajaxp.sPost = "POST";
ajaxp.xobj = {
    method: ajaxp.sGet,
    data: void 0,
    responseType: "text"
};
ajaxp.rt = "responseType";