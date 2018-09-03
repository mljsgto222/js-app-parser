"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var TextChunk = /** @class */ (function () {
    function TextChunk(xmlBytes, stringList) {
        // 跳过头和头大小
        this.size = tools_1.Tools.toInt(xmlBytes.slice(4, 8));
        this.lineNumber = tools_1.Tools.toInt(xmlBytes.slice(8, 12));
        //行号后面的四个字节为FFFF,过滤
        var index = tools_1.Tools.toInt(xmlBytes.slice(16, 20));
        this.name = stringList[index];
    }
    TextChunk.TYPE = 0x00100104;
    return TextChunk;
}());
exports.TextChunk = TextChunk;
