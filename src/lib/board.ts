import Container from "./container";
import FlowchartComp from "./flowchartComp";
import EC from "./ec";
import { unique } from "./dab";

export default class Board {

	protected __s: Container<EC | FlowchartComp>[];

	get containers(): Container<EC | FlowchartComp>[] { return this.__s }

	constructor(containers?: Container<EC | FlowchartComp>[]) {
		this.__s = containers || [];
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
	}

	public delete(name: string): Container<EC | FlowchartComp> | undefined {
		let
			ndx = index(this, name);
		return (ndx == -1) ? undefined : this.containers.splice(ndx, 1)[0]
	}

	public get(name: string): Container<EC | FlowchartComp> | undefined {
		return this.containers[index(this, name)]
	}

	public libraries(library: string): Container<EC | FlowchartComp>[] {
		return this.containers.filter(c => c.library == library)
	}

	public destroy() {
		this.containers
			.forEach(c => c.destroy());
		this.__s = <any>void 0;
	}

}

function index(board: Board, name: string): number {
	return board.containers.findIndex(c => c.name == name)
}