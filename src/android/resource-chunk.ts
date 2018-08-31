import { Tools } from "./tools";


export class ResourceChunk {
    size: number;
    ids: Array<number>;

    constructor(xmlBytes: Uint8Array) {
        // 跳过头和头大小
        this.size = Tools.toInt(xmlBytes.slice(4, 8));
        this.ids = [];
        let offset = 8;
        while(offset < this.size) {
            const id = Tools.toInt(xmlBytes.slice(offset, 4));
            offset += 4;
            this.ids.push(id);
        }
    }
}