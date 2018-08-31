import { Tools } from "./tools";


export class ResValue {
    size: number;
    res0: number;
    dataType: number;
    data: any;

    static getSize(): number {
        return 8;
    }

    constructor(xmlBytes: Uint8Array, stringList: Array<string>) {
        this.size = Tools.toShort(xmlBytes.slice(0, 2));
        this.res0 = xmlBytes[2];
        this.dataType = xmlBytes[3];
        this.data = Tools.getAttributeData(Tools.toInt(xmlBytes.slice(4, 8)), this.dataType, stringList);
    }
}