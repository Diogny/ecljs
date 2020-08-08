import { IBoardProperties, BaseSettings, IBoardOptions } from "./interfaces";
import Rect from "./rect";
import Point from "./point";
import Container from "./container";
import FlowchartComponent from "./flowchartComponent";
import EC from "./ec";
import { unique } from "./dab";

export default class Board extends BaseSettings {

	protected settings: IBoardProperties;

	get version(): string { return this.settings.version }
	get name(): string { return this.settings.name }
	set name(value: string) { this.settings.name = value }
	get description(): string { return this.settings.description }
	set description(value: string) { this.settings.description = value }
	get filePath(): string { return this.settings.filePath }
	get viewBox(): Rect { return this.settings.viewBox }
	get containers(): Container<EC | FlowchartComponent>[] { return this.settings.containers }

	public static defaultZoom: number = 1;	// 1X

	get zoom(): number { return this.settings.zoom }
	set zoom(value: number) {
		if (this.zoom != value && Board.validZoom(value)) {
			this.settings.zoom = value;
			this.settings.onZoom && this.settings.onZoom(value)
		}
	}

	public get modified(): boolean {
		//check for any change in containers
		if (!this.settings.modified && this.containers.some(c => c.modified))
			this.settings.modified = true;
		return this.settings.modified
	}
	public set modified(value: boolean) {
		//trying to set to false with containers modified, is overrided by true
		if (!value && this.containers.some(c => c.modified)) {
			value = true
		}
		this.settings.modified = value;
	}

	constructor(options: IBoardOptions) {
		super(options);
		if (options.viewPoint) {
			//panning
			this.viewBox.x = options.viewPoint.x;
			this.viewBox.y = options.viewPoint.y
		}
		let
			names = this.containers.map(c => c.name);
		if (names.length != unique(names).length)
			throw `duplicated container names`;
	}

	public add(container: Container<EC | FlowchartComponent>) {
		if (this.containers.some(c => c.name == container.name))
			throw `duplicated container name: ${container.name}`;
		this.containers.push(container)
	}

	public center(): Point {
		return new Point(
			Math.round(this.viewBox.x + this.viewBox.width / 2 | 0),
			Math.round(this.viewBox.y + this.viewBox.height / 2 | 0)
		)
	}

	public get(name: string): Container<EC | FlowchartComponent> | undefined {
		return this.containers.find(c => c.name == name)
	}

	public libraries(library: string): Container<EC | FlowchartComponent>[] {
		return this.containers.filter(c => c.library == library)
	}

	public destroy() {
		this.containers
			.forEach(c => c.destroy());
		this.settings = <any>void 0;
	}

	public propertyDefaults(): IBoardProperties {
		return <IBoardProperties>{
			version: "1.1.5",
			name: "",
			description: "",
			filePath: "",
			viewBox: Rect.empty(),
			zoom: 0,		//this way we must set zoom after creation to trigger event, 0 is an invalid zoom
			containers: [],
			modified: false,
			onZoom: <any>void 0
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