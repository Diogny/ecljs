import { ILibrary, IComponent } from './interfaces';
export declare class CompStore {
    /**
     * library
     */
    type: string;
    /**
     * library name: circuit, flowchart
     */
    name: string;
    version: string;
    store: Map<string, IComponent>;
    constructor(library: ILibrary);
    has: (name: string) => boolean;
    /**
     * @description find a component by name
     * @param name component name
     */
    find: (name: string) => IComponent | undefined;
    /**
     * returns all registered components, except wire and system components
     */
    get keys(): string[];
    get size(): number;
}
