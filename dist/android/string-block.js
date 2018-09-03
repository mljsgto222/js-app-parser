"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var StringBlock = /** @class */ (function () {
    function StringBlock(xmlBytes) {
        var _this = this;
        //跳过头和头大小
        this.size = tools_1.Tools.toInt(xmlBytes.slice(4, 8));
        this.stringCount = tools_1.Tools.toInt(xmlBytes.slice(8, 12));
        this.styleCount = tools_1.Tools.toInt(xmlBytes.slice(12, 16));
        this.flags = tools_1.Tools.toInt(xmlBytes.slice(16, 20));
        var decoder = tools_1.Tools.getDecoder(this.flags);
        var stringStart = tools_1.Tools.toInt(xmlBytes.slice(20, 24));
        var styleStart = tools_1.Tools.toInt(xmlBytes.slice(24, 28));
        var start = 28;
        var stringOffsetList = [];
        while (stringOffsetList.length < this.stringCount) {
            var stringOffset = tools_1.Tools.uintToInt(tools_1.Tools.toInt(xmlBytes.slice(start, start + 4)));
            start += 4;
            stringOffsetList.push(stringOffset);
        }
        // 不需要获取 样式偏移数组，跳过
        // const styleOffsetList = [];
        // while(styleOffsetList.length < styleSize) {
        //     const offset = longToInt(toInt(xmlBytes.slice(offset, offset + 4)));
        //     offset += 4
        //     styleOffsetList.push(offset);
        // }
        this.stringList = [];
        stringOffsetList.forEach(function (stringOffset) {
            var offset = stringStart + stringOffset;
            var size = 0;
            if (tools_1.Tools.isUTF8(_this.flags)) {
                size = xmlBytes.slice(offset, offset + 2)[1];
            }
            else {
                size = tools_1.Tools.toShort(xmlBytes.slice(offset, offset + 2)) * 2;
            }
            offset += 2;
            if (size !== 0) {
                var stringbytes = xmlBytes.slice(offset, offset + size);
                offset += size;
                _this.stringList.push(decoder.decode(stringbytes));
            }
            else {
                offset += 1;
                _this.stringList.push('');
            }
        });
        // 不需要获取字符串样式，跳过
    }
    return StringBlock;
}());
exports.StringBlock = StringBlock;
