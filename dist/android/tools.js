"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Encoding = require('text-encoding');
var UTF8_FLAG = 0x00000100;
var TYPE_ATTRIBUTE = 2;
var TYPE_DIMENSION = 5;
var TYPE_FIRST_COLOR_INT = 28;
var TYPE_FIRST_INT = 16;
var TYPE_FLOAT = 4;
var TYPE_FRACTION = 6;
var TYPE_INT_BOOLEAN = 18;
var TYPE_INT_COLOR_ARGB4 = 30;
var TYPE_INT_COLOR_ARGB8 = 28;
var TYPE_INT_COLOR_RGB4 = 31;
var TYPE_INT_COLOR_RGB8 = 29;
var TYPE_INT_DEC = 16;
var TYPE_INT_HEX = 17;
var TYPE_LAST_COLOR_INT = 31;
var TYPE_LAST_INT = 31;
var TYPE_NULL = 0;
var TYPE_REFERENCE = 1;
var TYPE_STRING = 3;
var RADIX_MULTS = [0.00390625, 3.051758E-005, 1.192093E-007, 4.656613E-010];
var DIMENSION_UNITS = ['px', 'dip', 'sp', 'pt', 'in', 'mm'];
var FRACTION_UNITS = ['%', '%p'];
var COMPLEX_UNIT_MASK = 15;
var UTF8_DECODER = new Encoding.TextDecoder('utf-8');
var UTF16_DECODER = new Encoding.TextDecoder('utf-16le');
var Tools = /** @class */ (function () {
    function Tools() {
    }
    Tools.isUTF8 = function (flags) {
        return (flags & UTF8_FLAG);
    };
    Tools.getDecoder = function (flags) {
        return (flags & UTF8_FLAG) ? UTF8_DECODER : UTF16_DECODER;
    };
    Tools.toShort = function (bytes) {
        return (bytes[1] & 0xff) << 8 | bytes[0] & 0xff;
    };
    Tools.toInt = function (bytes) {
        var result = 0;
        var innerBytes = new Uint8Array(4);
        innerBytes.set(bytes, 0);
        for (var i = 1; i <= 4; i++) {
            result = (innerBytes[4 - i] << ((4 - i) * 8)) | result;
        }
        return result;
    };
    Tools.complexToFloat = function (xComplex) {
        return (xComplex & 0xFFFFFF00) * RADIX_MULTS[(xComplex >> 4) & 3];
    };
    Tools.uintToInt = function (uint) {
        if (uint > 0x7fffffff) {
            uint = (0x7fffffff & uint) - 0x80000000;
        }
        return uint;
    };
    Tools.paddingStart = function (s, length, char) {
        while (s.length < length) {
            s = char + s;
        }
        return s.substring(s.length - length);
    };
    Tools.getPackage = function (data) {
        return (data >> 24) === 1 ? 'android' : '';
    };
    Tools.getAttributeData = function (data, type, stringList) {
        switch (type) {
            case TYPE_STRING:
                return stringList[data];
            case TYPE_ATTRIBUTE:
                return "?" + Tools.getPackage(data) + Tools.paddingStart(data.toString(16), 8, '0');
            case TYPE_REFERENCE:
                return "@" + Tools.getPackage(data) + Tools.paddingStart(data.toString(16), 8, '0');
            case TYPE_FLOAT:
                var dataView = new DataView(new ArrayBuffer(16), 0);
                dataView.setInt8(0, data);
                return "" + dataView.getFloat32(0);
            case TYPE_INT_HEX:
                return "0x" + Tools.paddingStart(data.toString(16), 8, '0');
            case TYPE_INT_BOOLEAN:
                return data !== 0 ? 'true' : 'false';
            case TYPE_DIMENSION:
                return "" + Tools.complexToFloat(data) + DIMENSION_UNITS[data & COMPLEX_UNIT_MASK];
            case TYPE_FRACTION:
                return "" + Tools.complexToFloat(data) + FRACTION_UNITS[data & COMPLEX_UNIT_MASK];
            default:
                if (type >= TYPE_FIRST_COLOR_INT && type <= TYPE_LAST_COLOR_INT) {
                    return "#" + Tools.paddingStart(data.toString(16), 8, '0');
                }
                else if (type >= TYPE_FIRST_INT && type <= TYPE_LAST_INT) {
                    return "" + Tools.uintToInt(data);
                }
                return "<0x" + Tools.paddingStart(data.toString(16), 8, '0') + " type 0x" + Tools.paddingStart(type.toString(16), 8, '0') + ">";
        }
    };
    Tools.UTF8_FLAG = UTF8_FLAG;
    return Tools;
}());
exports.Tools = Tools;
;
