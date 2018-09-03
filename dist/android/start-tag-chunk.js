"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var attribute_data_1 = require("./attribute-data");
var tools_1 = require("./tools");
var StartTagChunk = /** @class */ (function () {
    function StartTagChunk(xmlBytes, stringList) {
        //跳过头和头大小
        this.size = tools_1.Tools.toInt(xmlBytes.slice(4, 8));
        this.lineNumber = tools_1.Tools.toInt(xmlBytes.slice(8, 12));
        // 行号后面的四个字节为FFFF,过滤
        var uriIndex = tools_1.Tools.toInt(xmlBytes.slice(16, 20));
        if (uriIndex >= 0 && uriIndex < stringList.length) {
            this.uri = stringList[uriIndex];
        }
        var tagNameIndex = tools_1.Tools.toInt(xmlBytes.slice(20, 24));
        this.tagName = stringList[tagNameIndex];
        // 解析属性个数前需要跳过4个字节
        this.attrCount = tools_1.Tools.toInt(xmlBytes.slice(28, 32));
        // 跳过classType的4个字节
        this.attrs = [];
        var offset = 36;
        while (this.attrs.length < this.attrCount) {
            var attributeData = new attribute_data_1.AttributeData(xmlBytes.slice(offset, offset + attribute_data_1.AttributeData.getSize()), stringList);
            offset += attribute_data_1.AttributeData.getSize();
            this.attrs.push(attributeData);
        }
    }
    StartTagChunk.TYPE = 0x00100102;
    return StartTagChunk;
}());
exports.StartTagChunk = StartTagChunk;
