export declare class Tools {
    static toHex(plistBytes: Uint8Array): string;
    static toSimple(objInfo: number): boolean | null;
    static toInt(plistBytes: Uint8Array, objInfo: number): number;
    static concatBytes(...values: Array<Uint8Array>): Uint8Array;
    static longToBytes(num: number): Uint8Array;
    static intToBytes(num: number): Uint8Array;
}
