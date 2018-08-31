import { Tools } from "./tools";


export class TextChunk {
    static TYPE = 0x00100104;

    size: number;
    lineNumber: number;
    name: string;

    constructor(xmlBytes: Uint8Array, stringList: Array<string>) {
        // 跳过头和头大小
        this.size = Tools.toInt(xmlBytes.slice(4, 8));
        this.lineNumber = Tools.toInt(xmlBytes.slice(8, 12));
        //行号后面的四个字节为FFFF,过滤
        const index = Tools.toInt(xmlBytes.slice(16, 20));
        this.name = stringList[index];
    }
}