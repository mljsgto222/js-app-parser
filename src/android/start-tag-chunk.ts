import { AttributeData } from './attribute-data';
import { Tools } from './tools';

export class StartTagChunk {
    static TYPE = 0x00100102;

    size: number;
    lineNumber: number;
    uri?: string;
    tagName: string;
    attrCount: number;
    attrs: Array<AttributeData>;

    constructor(xmlBytes: Uint8Array, stringList: Array<string>) {
        //跳过头和头大小
        this.size = Tools.toInt(xmlBytes.slice(4, 8));
        this.lineNumber = Tools.toInt(xmlBytes.slice(8, 12));
        // 行号后面的四个字节为FFFF,过滤
        const uriIndex = Tools.toInt(xmlBytes.slice(16, 20))
        if (uriIndex >= 0 && uriIndex < stringList.length) {
            this.uri = stringList[uriIndex];
        }

        const tagNameIndex = Tools.toInt(xmlBytes.slice(20, 24));
        this.tagName = stringList[tagNameIndex];

        // 解析属性个数前需要跳过4个字节
        this.attrCount = Tools.toInt(xmlBytes.slice(28, 32));
        // 跳过classType的4个字节
        this.attrs = [];
        let offset = 36;
        while(this.attrs.length < this.attrCount) {
            const attributeData = new AttributeData(xmlBytes.slice(offset, offset + AttributeData.getSize()), stringList);
            offset += AttributeData.getSize();
            this.attrs.push(attributeData);
        }
    }
}