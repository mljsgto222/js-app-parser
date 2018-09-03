export declare class Tools {
    static UTF8_FLAG: number;
    static isUTF8(flags: number): number;
    static getDecoder(flags: number): any;
    static toShort(bytes: Uint8Array): number;
    static toInt(bytes: Uint8Array): number;
    static complexToFloat(xComplex: number): number;
    static uintToInt(uint: number): number;
    static paddingStart(s: string, length: number, char: string): string;
    static getPackage(data: number): "" | "android";
    static getAttributeData(data: number, type: number, stringList: Array<string>): any;
}
