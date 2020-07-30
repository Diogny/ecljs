import { IComponentOptions, IComponentMetadata } from './interfaces';
export default class Comp {
    private static baseComps;
    protected settings: IComponentOptions;
    get name(): string;
    get type(): string;
    get data(): string;
    get props(): any;
    get meta(): IComponentMetadata;
    constructor(options: IComponentOptions);
    static register: (options: IComponentOptions) => Comp;
    private static initializeComponents;
    static store: (name: string, comp: Comp) => boolean;
    static has: (name: string) => boolean;
    static find: (name: string) => Comp | undefined;
}