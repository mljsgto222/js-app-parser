import { ResValue } from './res-value';
import { ResTableMap } from './res-table-map';
import { Tools } from './tools';


export class ResTableEntry {
    size: number;
    flags: number;
    index: number;
    name: string;
    data?: ResValue | Array<ResTableMap>;
    static getSize(): number {
        return 8;
    }

    constructor(xmlBytes: Uint8Array, nameStringList: Array<string>) {
        this.size = Tools.toShort(xmlBytes.slice(0, 2));
        this.flags = Tools.toShort(xmlBytes.slice(2, 4));
        this.index = Tools.toInt(xmlBytes.slice(4, 8));
        this.name = nameStringList[this.index];
    }
}