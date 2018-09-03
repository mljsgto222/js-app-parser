"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Tools = /** @class */ (function () {
    function Tools() {
    }
    Tools.toHex = function (plistBytes) {
        var list = [];
        plistBytes.forEach(function (byte) {
            var s = byte.toString(16);
            if (s.length < 2) {
                s = '0' + s;
            }
            list.push(s);
        });
        return list.join('');
    };
    Tools.toSimple = function (objInfo) {
        switch (objInfo) {
            case 0x0:
                return null;
            case 0x8:
                return false;
            case 0x9:
                return true;
            case 0xf:
                return null;
            default:
                throw 'Unhandled simple type 0x' + objInfo.toString(16);
        }
    };
    Tools.toInt = function (plistBytes, objInfo) {
        var length = Math.pow(2, objInfo);
        var hex = Tools.toHex(plistBytes.slice(0, length));
        return parseInt(hex, 16);
    };
    Tools.concatBytes = function () {
        var values = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            values[_i] = arguments[_i];
        }
        var bytes = [];
        values.forEach(function (value) {
            value.forEach(function (byte) {
                bytes.push(byte);
            });
        });
        return new Uint8Array(bytes);
    };
    Tools.longToBytes = function (num) {
        var byteArray = [0, 0, 0, 0, 0, 0, 0, 0];
        for (var index = 0; index < byteArray.length; index++) {
            var byte = num & 0xff;
            byteArray[index] = byte;
            num = (num - byte) / 256;
        }
        return new Uint8Array(byteArray);
    };
    Tools.intToBytes = function (num) {
        return new Uint8Array([
            (num & 0xff000000) >> 24,
            (num & 0x00ff0000) >> 16,
            (num & 0x0000ff00) >> 8,
            (num & 0x000000ff)
        ]);
    };
    return Tools;
}());
exports.Tools = Tools;
