import { ResValue } from './res-value';
export declare class ResTableMap {
    index: number;
    value: ResValue;
    name?: string;
    static getSize(): number;
    constructor(xmlBytes: Uint8Array, stringList: Array<string>);
}
