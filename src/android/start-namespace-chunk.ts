import { Tools } from "./tools";


export class StartNamespaceChunk {
    static TYPE = 0x00100100;

    size: number;
    lineNumber: number;
    prefix: string;
    uri: string;

    constructor(xmlBytes: Uint8Array, stringList: Array<string>) {
        // 跳过头和头大小
        this.size = Tools.toInt(xmlBytes.slice(4, 8));
        this.lineNumber = Tools.toInt(xmlBytes.slice(8, 12));
        //行号后面的四个字节为FFFF,过滤
        const prefixIndex = Tools.toInt(xmlBytes.slice(16, 20));
        this.prefix = stringList[prefixIndex];
        const uriIndex = Tools.toInt(xmlBytes.slice(20, 24));
        this.uri = stringList[uriIndex];
    }
}