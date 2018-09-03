"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var ResValue = /** @class */ (function () {
    function ResValue(xmlBytes, stringList) {
        this.size = tools_1.Tools.toShort(xmlBytes.slice(0, 2));
        this.res0 = xmlBytes[2];
        this.dataType = xmlBytes[3];
        this.data = tools_1.Tools.getAttributeData(tools_1.Tools.toInt(xmlBytes.slice(4, 8)), this.dataType, stringList);
    }
    ResValue.getSize = function () {
        return 8;
    };
    return ResValue;
}());
exports.ResValue = ResValue;
