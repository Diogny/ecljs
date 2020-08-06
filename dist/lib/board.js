"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const interfaces_1 = require("./interfaces");
const templates_1 = require("./templates");
const rect_1 = tslib_1.__importDefault(require("./rect"));
const point_1 = tslib_1.__importDefault(require("./point"));
class Board extends interfaces_1.BaseSettings {
    constructor(options) {
        super(options);
        !Board.validZoom(this.zoom) && (this.settings.zoom = Board.defaultZoom);
    }
    get version() { return this.settings.version; }
    get name() { return this.settings.name; }
    get description() { return this.settings.description; }
    get filePath() { return this.settings.filePath; }
    get viewBox() { return this.settings.viewBox; }
    get containers() { return this.settings.containers; }
    get zoom() { return this.settings.zoom; }
    set zoom(value) {
        Board.validZoom(value)
            && (this.zoom != value)
            && (this.settings.zoom = value);
    }
    static get zoomMultipliers() {
        return Array.from([8, 4, 2, 1, 0.75, 0.5, 0.33, 0.25, 0.166, 0.125]);
    }
    static get zoomFactors() {
        return Array.from(["1/8X", "1/4X", "1/2X", "1X", "1 1/2X", "2X", "3X", "4X", "6X", "8X"]);
    }
    static validZoom(zoom) {
        return !(isNaN(zoom)
            || !Board.zoomMultipliers.some(z => z == zoom));
    }
    get modified() { return this.containers.some(c => c.modified); }
    add(container) {
        this.containers.push(container);
    }
    center() {
        return new point_1.default(Math.round(this.viewBox.x + this.viewBox.width / 2 | 0), Math.round(this.viewBox.y + this.viewBox.height / 2 | 0));
    }
    getXML() {
        return '<?xml version="1.0" encoding="utf-8"?>\n'
            + templates_1.Templates.parse('boardXml', {
                name: this.name,
                version: this.version,
                zoom: this.zoom,
                description: this.description,
                view: this.viewBox,
                data: this.containers.map(c => c.getXML()).join('\r\n')
            }, true);
    }
    propertyDefaults() {
        return {
            version: "1.1.5",
            name: "",
            description: "",
            filePath: "",
            viewBox: rect_1.default.empty(),
            zoom: 1,
            containers: [],
        };
    }
}
exports.default = Board;
Board.defaultZoom = 1; // 1X
