import { ResTableEntry } from './res-table-entry';
export declare class Resource {
    map: {
        [key in string]: Array<ResTableEntry | null>;
    };
    constructor(xmlBytes: Uint8Array);
}
