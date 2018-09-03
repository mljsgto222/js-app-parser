export declare class ResTableConfig {
    size: number;
    mcc: number;
    mnc: number;
    language: Uint8Array;
    country: Uint8Array;
    orientation: number;
    touchscreen: number;
    density: number;
    keyboard: number;
    navigation: number;
    inputFlags: number;
    inputPad0: number;
    screenWidth: number;
    screenHeight: number;
    sdVersion: number;
    minorVersion: number;
    screenLayout: number;
    uiMode: number;
    smallestScreenWidthDp: number;
    screenWidthDp: number;
    screenHeightDp: number;
    localeScript: Uint8Array;
    localeVariant: Uint8Array;
    static getSize(): number;
    constructor(xmlBytes: Uint8Array);
}
