export declare class AttributeData {
    name: string;
    nameSpaceUri: string;
    valueString: string;
    type: number;
    data: string;
    static getSize(): number;
    constructor(xmlBytes: Uint8Array, stringList: Array<string>);
}
