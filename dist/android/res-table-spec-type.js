"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var ResTableSpecType = /** @class */ (function () {
    function ResTableSpecType(xmlBytes, nameList) {
        // 跳过头和头大小
        this.size = tools_1.Tools.toInt(xmlBytes.slice(4, 8));
        this.typeId = xmlBytes[8];
        this.typeName = nameList[this.typeId - 1];
        //跳过3个备用字段
        this.typeCount = tools_1.Tools.toInt(xmlBytes.slice(12, 16));
        this.specValues = [];
        var offset = 16;
        while (this.specValues.length < this.typeCount) {
            var spceValue = tools_1.Tools.toInt(xmlBytes.slice(offset, offset + 4));
            offset += 4;
            this.specValues.push(spceValue);
        }
    }
    return ResTableSpecType;
}());
exports.ResTableSpecType = ResTableSpecType;
