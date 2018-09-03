"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var Encoding = require('text-encoding');
var pako = require('pako');
var CRC32 = require('crc-32');
var PNG_HEADER = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
var asciiDecoder = new Encoding.TextDecoder('ascii');
var asciiEncode = new Encoding.TextEncoder();
var CHUNK_TYPE_IDAT = 'IDAT';
var CHUNK_TYPE_IHDR = 'IHDR';
var CHUNK_TYPE_CGBI = 'CgBI';
var CHUNK_TYPE_IEND = 'IEND';
function parsePNG(pngBytes) {
    var header = pngBytes.slice(0, 8);
    if (tools_1.Tools.toHex(header) !== tools_1.Tools.toHex(PNG_HEADER)) {
        throw 'invalid png file';
    }
    var newPngBytes = pngBytes.slice(0, 8);
    var idatAcc = new Uint8Array([]);
    var breakLoop = false;
    var foundCgBI = false;
    var chunkPos = newPngBytes.length;
    var width = 0;
    var height = 0;
    while (chunkPos < pngBytes.length) {
        var skip = false;
        var chunkLength = parseInt(tools_1.Tools.toHex(pngBytes.slice(chunkPos, chunkPos + 4)), 16);
        var chunkType = pngBytes.slice(chunkPos + 4, chunkPos + 8);
        var chunkData = pngBytes.slice(chunkPos + 8, chunkPos + 8 + chunkLength);
        var chunkCRCBytes = pngBytes.slice(chunkPos + chunkLength + 8, chunkPos + chunkLength + 12);
        var chunkCRC = parseInt(tools_1.Tools.toHex(chunkCRCBytes), 16);
        chunkPos += chunkLength + 12;
        switch (asciiDecoder.decode(chunkType)) {
            case CHUNK_TYPE_IHDR:
                width = parseInt(tools_1.Tools.toHex(chunkData.slice(0, 4)), 16);
                height = parseInt(tools_1.Tools.toHex(chunkData.slice(4, 8)), 16);
                break;
            case CHUNK_TYPE_IDAT:
                idatAcc = tools_1.Tools.concatBytes(idatAcc, chunkData);
                skip = true;
                break;
            case CHUNK_TYPE_CGBI:
                skip = true;
                foundCgBI = true;
                break;
            case CHUNK_TYPE_IEND:
                chunkData = pako.inflate(idatAcc, {
                    windowBits: -15
                });
                chunkType = asciiEncode.encode(CHUNK_TYPE_IDAT);
                var newData = [];
                for (var h = 0; h < height; h++) {
                    var i = newData.length;
                    newData.push(chunkData[i]);
                    for (var w = 0; w < width; w++) {
                        i = newData.length;
                        newData.push(chunkData[i + 2]);
                        newData.push(chunkData[i + 1]);
                        newData.push(chunkData[i + 0]);
                        newData.push(chunkData[i + 3]);
                    }
                }
                chunkData = pako.deflate(new Uint8Array(newData));
                chunkLength = chunkData.length;
                chunkCRC = CRC32.buf(chunkType);
                chunkCRC = CRC32.buf(chunkData, chunkCRC);
                chunkCRC = (chunkCRC + 0x100000000) % 0x100000000;
                breakLoop = true;
                break;
        }
        if (!skip) {
            newPngBytes = tools_1.Tools.concatBytes(newPngBytes, tools_1.Tools.intToBytes(chunkLength));
            newPngBytes = tools_1.Tools.concatBytes(newPngBytes, chunkType);
            if (chunkLength > 0) {
                newPngBytes = tools_1.Tools.concatBytes(newPngBytes, chunkData);
            }
            newPngBytes = tools_1.Tools.concatBytes(newPngBytes, tools_1.Tools.intToBytes(chunkCRC));
        }
        if (breakLoop) {
            break;
        }
        if (!foundCgBI) {
            throw 'It shout be not Xcode PNG format';
        }
    }
    return newPngBytes;
}
exports.parsePNG = parsePNG;
