"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var Encoding = require('text-encoding');
// EPOCH = new SimpleDateFormat("yyyy MM dd zzz").parse("2001 01 01 GMT").getTime();
// ...but that's annoying in a static initializer because it can throw exceptions, ick.
// So we just hardcode the correct value.
var EPOCH = 978307200000;
var utf8Decoder = new Encoding.TextDecoder('utf-8');
var ascDecoder = new Encoding.TextDecoder('ascii');
var utf16Decoder = new Encoding.TextDecoder('utf-16be');
var TYPE_SIMPLE = 0x0;
var TYPE_INTEGER = 0x1;
var TYPE_REAL = 0x2;
var TYPE_DATE = 0x3;
var TYPE_DATA = 0x4;
var TYPE_ASCII = 0x5;
var TYPE_UTF_16 = 0x6;
var TYPE_ARRAY = 0xa;
var TYPE_DICTIONARY = 0xd;
var TYPE_UID = 0x8;
var offsetTable;
;
var objectRefSize;
function parseObject(plistBytes, offset) {
    var type = plistBytes[offset];
    var objType = (type & 0xf0) >> 4;
    var objInfo = (type & 0x0f);
    switch (objType) {
        case TYPE_SIMPLE:
            return tools_1.Tools.toSimple(objInfo);
        case TYPE_INTEGER:
            return tools_1.Tools.toInt(plistBytes.slice(offset + 1), objInfo);
        case TYPE_UID:
            return toUID(plistBytes.slice(offset + 1), objInfo);
        case TYPE_REAL:
            return toReal(plistBytes.slice(offset + 1), objInfo);
        case TYPE_DATE:
            return toDate(plistBytes.slice(offset + 1), objInfo);
        case TYPE_DATA:
            return toData(plistBytes.slice(offset + 1), objInfo);
        case TYPE_ASCII:
            return toString(plistBytes.slice(offset + 1), objInfo);
        case TYPE_UTF_16:
            return toString(plistBytes.slice(offset + 1), objInfo, true);
        case TYPE_ARRAY:
            return toArray(plistBytes.slice(offset + 1), objInfo, objectRefSize, plistBytes);
        case TYPE_DICTIONARY:
            return toDictionary(plistBytes.slice(offset + 1), objInfo, objectRefSize, plistBytes);
        default:
            throw 'Unhandled type 0x' + objType.toString(16);
    }
}
function toUID(plistBytes, objInfo) {
    var length = objInfo;
    return new UID(parseInt(tools_1.Tools.toHex(plistBytes.slice(0, length)), 16));
}
function toReal(plistBytes, objInfo) {
    var length = Math.pow(2, objInfo);
    var dataView = new DataView(plistBytes.slice(0, length).buffer, 0);
    if (length === 4) {
        return dataView.getFloat32(0);
    }
    else {
        return dataView.getFloat64(0);
    }
}
function toDate(plistBytes, objInfo) {
    if (objInfo != 0x3) {
        throw 'error date';
    }
    var dataView = new DataView(plistBytes.slice(0, 8).buffer, 0);
    return new Date(EPOCH + (1000 * dataView.getFloat64(0)));
}
function toData(plistBytes, objInfo) {
    var length = objInfo;
    var dataOffset = 0;
    if (objInfo === 0xf) {
        var intType = (plistBytes[0] & 0xf0) >> 4;
        if (intType != 0x1) {
            console.error("0x4: UNEXPECTED LENGTH-INT TYPE! " + intType);
        }
        var intInfo = (plistBytes[0] & 0x0f);
        var intLength = Math.pow(2, intInfo);
        length = parseInt(tools_1.Tools.toHex(plistBytes.slice(1, 1 + intLength)), 16);
    }
    return plistBytes.slice(dataOffset, dataOffset + length);
}
function toString(plistBytes, objInfo, isUTF16) {
    if (isUTF16 === void 0) { isUTF16 = false; }
    var length = objInfo;
    var stringOffset = 0;
    if (objInfo === 0xf) {
        var intType = (plistBytes[0] & 0xf0) >> 4;
        if (intType !== 0x1) {
            console.error("UNEXPECTED LENGTH-INT TYPE! " + intType);
        }
        var intInfo = (plistBytes[0] & 0x0f);
        var intLength = Math.pow(2, intInfo);
        stringOffset = 1 + intLength;
        length = parseInt(tools_1.Tools.toHex(plistBytes.slice(1, 1 + intLength)), 16);
    }
    length *= isUTF16 ? 2 : 1;
    var stringBytes = plistBytes.slice(stringOffset, stringOffset + length);
    if (isUTF16) {
        return utf16Decoder.decode(stringBytes);
    }
    else {
        return ascDecoder.decode(stringBytes);
    }
}
function toArray(plistBytes, objInfo, objectRefSize, fullBytes) {
    var length = objInfo;
    var arrayOffset = 0;
    if (objInfo === 0xf) {
        var intType = (plistBytes[0] & 0xf0) >> 4;
        if (intType != 0x1) {
            console.error("0x4: UNEXPECTED LENGTH-INT TYPE! " + intType);
        }
        var intInfo = (plistBytes[0] & 0x0f);
        var intLength = Math.pow(2, intInfo);
        arrayOffset = 1 + intLength;
        length = parseInt(tools_1.Tools.toHex(plistBytes.slice(1, 1 + intLength)), 16);
    }
    var array = [];
    for (var i = 0; i < length; i++) {
        var objRef = parseInt(tools_1.Tools.toHex(plistBytes.slice(arrayOffset + i * objectRefSize, arrayOffset + (i + 1) * objectRefSize)), 16);
        array.push(parseObject(fullBytes, offsetTable[objRef]));
    }
    return array;
}
function toDictionary(plistBytes, objInfo, objectRefSize, fullBytes) {
    var length = objInfo;
    var dicOffset = 0;
    if (objInfo == 0xf) {
        var intType = (plistBytes[0] & 0xf0) >> 4;
        if (intType != 0x1) {
            console.error("0x4: UNEXPECTED LENGTH-INT TYPE! " + intType);
        }
        var intInfo = (plistBytes[0] & 0x0f);
        var intLength = Math.pow(2, intInfo);
        dicOffset = 1 + intLength;
        length = parseInt(tools_1.Tools.toHex(plistBytes.slice(1, 1 + intLength)), 16);
    }
    var dic = {};
    for (var i = 0; i < length; i++) {
        var keyRef = parseInt(tools_1.Tools.toHex(plistBytes.slice(dicOffset + i * objectRefSize, dicOffset + (i + 1) * objectRefSize)), 16);
        var valRef = parseInt(tools_1.Tools.toHex(plistBytes.slice(dicOffset + (length * objectRefSize) + i * objectRefSize, dicOffset + (length * objectRefSize) + (i + 1) * objectRefSize)), 16);
        var key = parseObject(fullBytes, offsetTable[keyRef]);
        var value = parseObject(fullBytes, offsetTable[valRef]);
        dic[key] = value;
    }
    return dic;
}
function parsePlist(plistBytes) {
    var header = utf8Decoder.decode(plistBytes.slice(0, 'bplist'.length));
    if (header !== 'bplist') {
        return utf8Decoder.decode(plistBytes);
    }
    // Handle trailer, last 32 bytes of the file
    var trailer = plistBytes.slice(plistBytes.length - 32);
    var offsetSize = trailer[6];
    objectRefSize = trailer[7];
    var objectCount = parseInt(tools_1.Tools.toHex(trailer.slice(8, 16)), 16);
    var topObjectIndex = parseInt(tools_1.Tools.toHex(trailer.slice(16, 24)), 16);
    var offsetTableOffset = parseInt(tools_1.Tools.toHex(trailer.slice(24, 32)), 16);
    offsetTable = [];
    for (var i = 0; i < objectCount; i++) {
        var offset = tools_1.Tools.toHex(plistBytes.slice(offsetTableOffset + i * offsetSize, offsetTableOffset + (i + 1) * offsetSize));
        offsetTable.push(parseInt(offset, 16));
    }
    var info = parseObject(plistBytes, offsetTable[topObjectIndex]);
    return new PList(info);
}
exports.parsePlist = parsePlist;
var PList = /** @class */ (function () {
    function PList(info) {
        this.info = info;
        this.platform = 'ios';
    }
    return PList;
}());
exports.PList = PList;
var UID = /** @class */ (function () {
    function UID(id) {
        this.id = id;
    }
    return UID;
}());
