import { ResTableEntry } from './res-table-entry';
import { Tools } from './tools';

export class ResTableMapEntry extends ResTableEntry{
    parent: number;
    count: number;

    static getSize(): number {
        return 16;
    }

    constructor(xmlBytes: Uint8Array, nameList: Array<string>) {
        super(xmlBytes, nameList);
        this.parent = Tools.toInt(xmlBytes.slice(8, 12));
        this.count = Tools.toInt(xmlBytes.slice(12, 16));
    }
}