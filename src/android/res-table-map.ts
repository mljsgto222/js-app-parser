import { ResValue } from './res-value';
import { Tools } from './tools';


export class ResTableMap {
    index: number;
    value: ResValue;
    name?: string;

    static getSize(): number {
        return 4 + ResValue.getSize();
    }

    constructor(xmlBytes: Uint8Array, stringList: Array<string>) {
        this.index = Tools.toInt(xmlBytes.slice(0, 4));
        this.value = new ResValue(xmlBytes.slice(4, 4 + ResValue.getSize()), stringList);
    }
}