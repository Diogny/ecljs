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
		if (!isNaN(value) && this.zoom != value) {
			this.__s.zoom = value;
			this.modified = true;
			this.__s.onZoom && this.__s.onZoom(value)
		}
	}

	public get modified(): boolean { return this.__s.modified }
	public set modified(value: boolean) {
		//brings uniformity to all containers
		this.containers
			.forEach(c => c.setModified(value));
		this.__s.modified = value;
		this.__s.onModified && this.__s.onModified(value);
	}

	constructor(options: IBoardOptions) {
		super(options);
		if (options.viewPoint) {
			//panning
			this.viewBox.x = options.viewPoint.x | 0;
			this.viewBox.y = options.viewPoint.y | 0
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


}