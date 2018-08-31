import { Tools } from "./tools";


export class StringBlock {
    size: number;
    stringCount: number;
    styleCount: number;
    flags: number;
    // stringOffsetList: Array<number>;
    stringList: Array<string>;

    constructor(xmlBytes: Uint8Array) {
        //跳过头和头大小
        this.size = Tools.toInt(xmlBytes.slice(4, 8));
        this.stringCount = Tools.toInt(xmlBytes.slice(8, 12));
        this.styleCount = Tools.toInt(xmlBytes.slice(12, 16));
        this.flags = Tools.toInt(xmlBytes.slice(16, 20));
        const decoder = Tools.getDecoder(this.flags);
        const stringStart = Tools.toInt(xmlBytes.slice(20, 24));
        const styleStart = Tools.toInt(xmlBytes.slice(24, 28));
        let start = 28;
        const stringOffsetList = [];
        while (stringOffsetList.length < this.stringCount) {
            const stringOffset = Tools.uintToInt(Tools.toInt(xmlBytes.slice(start, start + 4)));
            start += 4;
            stringOffsetList.push(stringOffset);
        }
        // 不需要获取 样式偏移数组，跳过
        // const styleOffsetList = [];
        // while(styleOffsetList.length < styleSize) {
        //     const offset = longToInt(toInt(xmlBytes.slice(offset, offset + 4)));
        //     offset += 4
        //     styleOffsetList.push(offset);
        // }
        this.stringList = [];
        stringOffsetList.forEach(stringOffset => {
            let offset = stringStart + stringOffset;
            let size = 0;
            if (Tools.isUTF8(this.flags)) {
                size = xmlBytes.slice(offset, offset + 2)[1];
            } else {
                size = Tools.toShort(xmlBytes.slice(offset, offset + 2)) * 2;
            }

            offset += 2
            if (size !== 0) {
                const stringbytes = xmlBytes.slice(offset, offset + size);
                offset += size;
                this.stringList.push(decoder.decode(stringbytes));
            } else {
                offset += 1;
                this.stringList.push('');
            }
        });
        // 不需要获取字符串样式，跳过
    }
}