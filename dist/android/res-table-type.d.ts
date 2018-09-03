import { ResTableConfig } from './res-table-config';
import { ResTableEntry } from './res-table-entry';
export declare class ResTableType {
    size: number;
    typeId: number;
    typeName: string;
    entriesCount: number;
    resTableConfig: ResTableConfig;
    entityOffsets: Array<number>;
    resEntries: Array<ResTableEntry | null>;
    constructor(xmlBytes: Uint8Array, nameList: Array<string>, typeList: Array<string>, stringList: Array<string>);
}
