import { IBoardProperties, Base, IBoardOptions } from "./interfaces";
import Rect from "./rect";
import Point from "./point";
import Container from "./container";
import FlowchartComp from "./flowchartComp";
import EC from "./ec";
import { unique } from "./dab";

export default class Board extends Base {

	protected __s: IBoardProperties;

	//later find a way to detect a change in any property:  "name" "description"  "zoom"
	get version(): string { return this.__s.version }
	get name(): string { return this.__s.name }
	set name(value: string) {
		this.__s.name = value
	}
	get description(): string | undefined { return this.__s.description }
	set description(value: string | undefined) {
		this.__s.description = value
	}
	get filePath(): string | undefined { return this.__s.filePath }
	get viewBox(): Rect { return this.__s.viewBox }
	get containers(): Container<EC | FlowchartComp>[] { return this.__s.containers }

	public static defaultZoom: number = 1;	// 1X

	get zoom(): number { return this.__s.zoom }
	set zoom(value: number) {
		if (this.zoom != value && Board.validZoom(value)) {
			this.__s.zoom = value;
			this.modified = true;
			this.__s.onZoom && this.__s.onZoom(value)
		}
	}

	public get modified(): boolean {
		//check for any change in containers
		if (!this.__s.modified && this.containers.some(c => c.modified))
			this.__s.modified = true;
		return this.__s.modified
	}
	public set modified(value: boolean) {
		//trying to set to false with containers modified, is overrided by true
		// all containers must have modified == false, to go through this
		if (!value && this.containers.some(c => c.modified)) {
			value = true
		}
		this.__s.modified = value;
		this.__s.onModified && this.__s.onModified(value);
	}

	constructor(options: IBoardOptions) {
		super(options);
		if (options.viewPoint) {
			//panning
			this.viewBox.x = options.viewPoint.x;
			this.viewBox.y = options.viewPoint.y
		}
		let
			names = this.containers.map(c => {
				c.board = this;
				return c.name
			});
		if (names.length != unique(names).length)
			throw `duplicated container names`;
	}

	public add(container: Container<EC | FlowchartComp>) {
		if (this.containers.some(c => c.name == container.name))
			throw `duplicated container name: ${container.name}`;
		this.containers.push(container);
		container.board = this;
		this.modified = true;
	}

	public center(): Point {
		return new Point(
			Math.round(this.viewBox.x + this.viewBox.width / 2 | 0),
			Math.round(this.viewBox.y + this.viewBox.height / 2 | 0)
		)
	}

	public get(name: string): Container<EC | FlowchartComp> | undefined {
		return this.containers.find(c => c.name == name)
	}

	public libraries(library: string): Container<EC | FlowchartComp>[] {
		return this.containers.filter(c => c.library == library)
	}

	public destroy() {
		this.containers
			.forEach(c => c.destroy());
		this.__s = <any>void 0;
	}

	public defaults(): IBoardProperties {
		return <IBoardProperties>{
			version: "1.1.5",
			name: "",
			description: "",
			filePath: "",
			viewBox: Rect.empty(),
			zoom: 0,		//this way we must set zoom after creation to trigger event, 0 is an invalid zoom
			containers: [],
			modified: false,
			onZoom: void 0,
			onModified: void 0
		}
	}

	public static get zoomMultipliers(): number[] {
		return Array.from([8, 4, 2, 1, 0.75, 0.5, 0.33, 0.25, 0.166, 0.125]);
	}

	public static get zoomFactors(): string[] {
		return Array.from(["1/8X", "1/4X", "1/2X", "1X", "1 1/2X", "2X", "3X", "4X", "6X", "8X"]);
	}

	public static validZoom(zoom: number): boolean {
		return !(
			isNaN(zoom)
			|| !Board.zoomMultipliers.some(z => z == zoom)
		)
	}
}