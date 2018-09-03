export declare class EndTagChunk {
    static TYPE: number;
    size: number;
    lineNumber: number;
    prefix: string;
    uri: string;
    constructor(xmlBytes: Uint8Array, stringList: Array<string>);
}
