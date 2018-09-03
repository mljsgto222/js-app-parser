export declare class EndNamespaceChunk {
    static TYPE: number;
    size: number;
    lineNumber: number;
    prefix: string;
    uri: string;
    constructor(xmlBytes: Uint8Array, stringList: Array<string>);
}
