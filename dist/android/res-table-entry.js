"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var ResTableEntry = /** @class */ (function () {
    function ResTableEntry(xmlBytes, nameStringList) {
        this.size = tools_1.Tools.toShort(xmlBytes.slice(0, 2));
        this.flags = tools_1.Tools.toShort(xmlBytes.slice(2, 4));
        this.index = tools_1.Tools.toInt(xmlBytes.slice(4, 8));
        this.name = nameStringList[this.index];
    }
    ResTableEntry.getSize = function () {
        return 8;
    };
    return ResTableEntry;
}());
exports.ResTableEntry = ResTableEntry;
