import { ResTableEntry } from './res-table-entry';
export declare class ResTableMapEntry extends ResTableEntry {
    parent: number;
    count: number;
    static getSize(): number;
    constructor(xmlBytes: Uint8Array, nameList: Array<string>);
}
