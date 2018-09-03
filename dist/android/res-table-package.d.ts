import { ResTableEntry } from './res-table-entry';
export declare class ResTablePackage {
    headerSize: number;
    size: number;
    packageId: number;
    packageName: string;
    lastPublicType: number;
    lastPublicKey: number;
    tableMapCache: {
        [key in string]: any;
    };
    destity: number;
    tableMap: {
        [key in string]: Array<ResTableEntry | null>;
    };
    constructor(xmlBytes: Uint8Array, stringList: Array<string>);
}
