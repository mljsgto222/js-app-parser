import { Tools } from "./tools";


export class ResTableConfig {
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

    static getSize(): number {
        return 48;
    }

    constructor(xmlBytes: Uint8Array) {
        this.size = Tools.toInt(xmlBytes.slice(0, 4));
        this.mcc = Tools.toShort(xmlBytes.slice(4, 6));
        this.mnc = Tools.toShort(xmlBytes.slice(6, 8));

        this.language = xmlBytes.slice(8, 10);
        this.country = xmlBytes.slice(10, 12);

        this.orientation = xmlBytes[12];
        this.touchscreen = xmlBytes[13];
        this.density = Tools.toShort(xmlBytes.slice(14, 16));

        this.keyboard = xmlBytes[16];
        this.navigation = xmlBytes[17];
        this.inputFlags = xmlBytes[18];
        this.inputPad0 = xmlBytes[19];

        this.screenWidth = Tools.toShort(xmlBytes.slice(20, 22));
        this.screenHeight = Tools.toShort(xmlBytes.slice(22, 24));

        this.sdVersion = Tools.toShort(xmlBytes.slice(24, 26));
        this.minorVersion = Tools.toShort(xmlBytes.slice(26, 28));

        this.screenLayout = xmlBytes[28];
        this.uiMode = xmlBytes[29];
        this.smallestScreenWidthDp = Tools.toShort(xmlBytes.slice(30, 32));

        this.screenWidthDp = Tools.toShort(xmlBytes.slice(32, 34));
        this.screenHeightDp = Tools.toShort(xmlBytes.slice(34, 36));

        this.localeScript = xmlBytes.slice(36, 40);
        this.localeVariant = xmlBytes.slice(40, 48);
    }
}