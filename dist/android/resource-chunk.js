"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var ResourceChunk = /** @class */ (function () {
    function ResourceChunk(xmlBytes) {
        // 跳过头和头大小
        this.size = tools_1.Tools.toInt(xmlBytes.slice(4, 8));
        this.ids = [];
        var offset = 8;
        while (offset < this.size) {
            var id = tools_1.Tools.toInt(xmlBytes.slice(offset, 4));
            offset += 4;
            this.ids.push(id);
        }
    }
    return ResourceChunk;
}());
exports.ResourceChunk = ResourceChunk;
