import { Tools } from "./tools";


export class ResTableSpecType {
    size: number;
    typeId: number;
    typeCount: number;
    typeName: string;
    specValues: Array<number>;

    constructor(xmlBytes: Uint8Array, nameList: Array<string>) {
        // 跳过头和头大小
        this.size = Tools.toInt(xmlBytes.slice(4, 8));
        this.typeId = xmlBytes[8];
        this.typeName = nameList[this.typeId - 1];
        //跳过3个备用字段
        this.typeCount = Tools.toInt(xmlBytes.slice(12, 16));
        this.specValues = [];
        let offset = 16;
        while(this.specValues.length < this.typeCount) {
            const spceValue = Tools.toInt(xmlBytes.slice(offset, offset + 4));
            offset += 4;
            this.specValues.push(spceValue);
        }
    }
}