export declare class ResValue {
    size: number;
    res0: number;
    dataType: number;
    data: any;
    static getSize(): number;
    constructor(xmlBytes: Uint8Array, stringList: Array<string>);
}
