export declare class TextChunk {
    static TYPE: number;
    size: number;
    lineNumber: number;
    name: string;
    constructor(xmlBytes: Uint8Array, stringList: Array<string>);
}
