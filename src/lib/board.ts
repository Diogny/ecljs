import { IBoardProperties, BaseSettings, IBoardOptions } from "./interfaces";
import Rect from "./rect";
import Point from "./point";
import Container from "./container";
import FlowchartComponent from "./flowchartComponent";
import EC from "./ec";

export default class Board extends BaseSettings {

	protected settings: IBoardProperties;

	public get version(): string { return this.settings.version }
	public get name(): string { return this.settings.name }
	public get description(): string { return this.settings.description }
	public get filePath(): string { return this.settings.filePath }
	public get viewBox(): Rect { return this.settings.viewBox }
	public get containers(): Container<EC | FlowchartComponent>[] { return this.settings.containers }

	public static defaultZoom: number = 1;	// 1X

	get zoom(): number { return this.settings.zoom }
	set zoom(value: number) {
		setZoom(this, value, false)
	}

	public get modified(): boolean { return this.containers.some(c => c.modified) }

	constructor(options: IBoardOptions) {
		super(options);
	}

	public add(container: Container<EC | FlowchartComponent>) {
		this.containers.push(container)
	}

	public center(): Point {
		return new Point(
			Math.round(this.viewBox.x + this.viewBox.width / 2 | 0),
			Math.round(this.viewBox.y + this.viewBox.height / 2 | 0)
		)
	}

	public get(library: string): Container<EC | FlowchartComponent> | undefined {
		return this.containers.find(c => c.library == library)
	}

	public clear(options: IBoardOptions): void {
		this.settings && this.containers
			.forEach(c => c.destroy());
		super.clear(options);
		setUpBoard(this, options)
	}

	public propertyDefaults(): IBoardProperties {
		return <IBoardProperties>{
			version: "1.1.5",
			name: "",
			description: "",
			filePath: "",
			viewBox: Rect.empty(),
			zoom: Board.defaultZoom,
			containers: [],
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

function setZoom(board: Board, value: number, force: boolean) {
	if (force || board.zoom != value) {
		!Board.validZoom(value) && (value = Board.defaultZoom);
		(<any>board).settings.zoom = value;
		(<any>board).settings.onZoom && (<any>board).settings.onZoom(value)
	}
}

function setUpBoard(board: Board, options: IBoardOptions) {
	if (options.viewPoint) {
		//panning
		board.viewBox.x = options.viewPoint.x;
		board.viewBox.y = options.viewPoint.y
	}
	setZoom(board, options.zoom || Board.defaultZoom, true);
}