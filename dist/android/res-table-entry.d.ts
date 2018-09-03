import { ResValue } from './res-value';
import { ResTableMap } from './res-table-map';
export declare class ResTableEntry {
    size: number;
    flags: number;
    index: number;
    name: string;
    data?: ResValue | Array<ResTableMap>;
    static getSize(): number;
    constructor(xmlBytes: Uint8Array, nameStringList: Array<string>);
}
