export declare class StringBlock {
    size: number;
    stringCount: number;
    styleCount: number;
    flags: number;
    stringList: Array<string>;
    constructor(xmlBytes: Uint8Array);
}
