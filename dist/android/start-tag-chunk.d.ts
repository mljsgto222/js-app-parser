import { AttributeData } from './attribute-data';
export declare class StartTagChunk {
    static TYPE: number;
    size: number;
    lineNumber: number;
    uri?: string;
    tagName: string;
    attrCount: number;
    attrs: Array<AttributeData>;
    constructor(xmlBytes: Uint8Array, stringList: Array<string>);
}
