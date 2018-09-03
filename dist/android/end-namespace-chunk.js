"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var EndNamespaceChunk = /** @class */ (function () {
    function EndNamespaceChunk(xmlBytes, stringList) {
        // 跳过头和头大小
        this.size = tools_1.Tools.toInt(xmlBytes.slice(4, 8));
        this.lineNumber = tools_1.Tools.toInt(xmlBytes.slice(8, 12));
        //行号后面的四个字节为FFFF,过滤
        var prefixIndex = tools_1.Tools.toInt(xmlBytes.slice(16, 20));
        this.prefix = stringList[prefixIndex];
        var uriIndex = tools_1.Tools.toInt(xmlBytes.slice(20, 24));
        this.uri = stringList[uriIndex];
    }
    EndNamespaceChunk.TYPE = 0x00100101;
    return EndNamespaceChunk;
}());
exports.EndNamespaceChunk = EndNamespaceChunk;
