"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var ResTableConfig = /** @class */ (function () {
    function ResTableConfig(xmlBytes) {
        this.size = tools_1.Tools.toInt(xmlBytes.slice(0, 4));
        this.mcc = tools_1.Tools.toShort(xmlBytes.slice(4, 6));
        this.mnc = tools_1.Tools.toShort(xmlBytes.slice(6, 8));
        this.language = xmlBytes.slice(8, 10);
        this.country = xmlBytes.slice(10, 12);
        this.orientation = xmlBytes[12];
        this.touchscreen = xmlBytes[13];
        this.density = tools_1.Tools.toShort(xmlBytes.slice(14, 16));
        this.keyboard = xmlBytes[16];
        this.navigation = xmlBytes[17];
        this.inputFlags = xmlBytes[18];
        this.inputPad0 = xmlBytes[19];
        this.screenWidth = tools_1.Tools.toShort(xmlBytes.slice(20, 22));
        this.screenHeight = tools_1.Tools.toShort(xmlBytes.slice(22, 24));
        this.sdVersion = tools_1.Tools.toShort(xmlBytes.slice(24, 26));
        this.minorVersion = tools_1.Tools.toShort(xmlBytes.slice(26, 28));
        this.screenLayout = xmlBytes[28];
        this.uiMode = xmlBytes[29];
        this.smallestScreenWidthDp = tools_1.Tools.toShort(xmlBytes.slice(30, 32));
        this.screenWidthDp = tools_1.Tools.toShort(xmlBytes.slice(32, 34));
        this.screenHeightDp = tools_1.Tools.toShort(xmlBytes.slice(34, 36));
        this.localeScript = xmlBytes.slice(36, 40);
        this.localeVariant = xmlBytes.slice(40, 48);
    }
    ResTableConfig.getSize = function () {
        return 48;
    };
    return ResTableConfig;
}());
exports.ResTableConfig = ResTableConfig;
