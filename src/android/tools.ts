const Encoding = require('text-encoding');

const UTF8_FLAG = 0x00000100;

const TYPE_ATTRIBUTE = 2
const TYPE_DIMENSION = 5
const TYPE_FIRST_COLOR_INT = 28
const TYPE_FIRST_INT = 16
const TYPE_FLOAT = 4
const TYPE_FRACTION = 6
const TYPE_INT_BOOLEAN = 18
const TYPE_INT_COLOR_ARGB4 = 30
const TYPE_INT_COLOR_ARGB8 = 28
const TYPE_INT_COLOR_RGB4 = 31
const TYPE_INT_COLOR_RGB8 = 29
const TYPE_INT_DEC = 16
const TYPE_INT_HEX = 17
const TYPE_LAST_COLOR_INT = 31
const TYPE_LAST_INT = 31
const TYPE_NULL = 0
const TYPE_REFERENCE = 1
const TYPE_STRING = 3

const RADIX_MULTS = [0.00390625, 3.051758E-005, 1.192093E-007, 4.656613E-010]
const DIMENSION_UNITS = ['px', 'dip', 'sp', 'pt', 'in', 'mm']
const FRACTION_UNITS = ['%', '%p']
const COMPLEX_UNIT_MASK = 15

const UTF8_DECODER = new Encoding.TextDecoder('utf-8');
const UTF16_DECODER = new Encoding.TextDecoder('utf-16le');

export class Tools {
    static UTF8_FLAG = UTF8_FLAG;

    static isUTF8(flags: number) {
        return (flags & UTF8_FLAG);
    }

    static getDecoder(flags: number) {
        return (flags & UTF8_FLAG)? UTF8_DECODER: UTF16_DECODER;
    }

    static toShort(bytes: Uint8Array): number {
        return (bytes[1] & 0xff) << 8 | bytes[0] & 0xff
    }

    static toInt(bytes: Uint8Array): number {
        let result = 0;
        const innerBytes = new Uint8Array(4);
        innerBytes.set(bytes, 0);
        for (let i = 1; i <= 4; i++) {
            result = (innerBytes[4 - i] << ((4 - i) * 8)) | result;
        }
        return result;
    }

    static complexToFloat(xComplex: number) {
        return (xComplex & 0xFFFFFF00) * RADIX_MULTS[(xComplex >> 4) & 3];
    }

    static uintToInt(uint: number): number {
        if(uint > 0x7fffffff) {
            uint = (0x7fffffff & uint) - 0x80000000;
        }
        return uint;
    }

    static paddingStart(s: string, length: number, char: string): string {
        while(s.length < length) {
            s = char + s;
        }
        return s.substring(s.length - length);
    }

    static getPackage(data: number) {
        return (data >> 24) === 1? 'android': '';
    }

    static getAttributeData(data: number, type: number, stringList: Array<string>): any {
        switch (type) {
            case TYPE_STRING:
                return stringList[data];
            case TYPE_ATTRIBUTE:
                return `?${Tools.getPackage(data)}${Tools.paddingStart(data.toString(16), 8, '0')}`; 
            case TYPE_REFERENCE:
                return `@${Tools.getPackage(data)}${Tools.paddingStart(data.toString(16), 8, '0')}`;
            case TYPE_FLOAT:
                const dataView = new DataView(new ArrayBuffer(16), 0);
                dataView.setInt8(0, data);
                return `${dataView.getFloat32(0)}`; 
            case TYPE_INT_HEX:
                return `0x${Tools.paddingStart(data.toString(16), 8, '0')}`;
            case TYPE_INT_BOOLEAN:
                return data !== 0? 'true': 'false'; 
            case TYPE_DIMENSION:
                return `${Tools.complexToFloat(data)}${DIMENSION_UNITS[data & COMPLEX_UNIT_MASK]}`;
            case TYPE_FRACTION:
                return `${Tools.complexToFloat(data)}${FRACTION_UNITS[data & COMPLEX_UNIT_MASK]}`;
            default:
                if (type >= TYPE_FIRST_COLOR_INT && type <= TYPE_LAST_COLOR_INT) {
                    return `#${Tools.paddingStart(data.toString(16), 8, '0')}`;
                } else if (type >= TYPE_FIRST_INT && type <= TYPE_LAST_INT) {
                    return `${Tools.uintToInt(data)}`;
                }
                return `<0x${Tools.paddingStart(data.toString(16), 8, '0')} type 0x${Tools.paddingStart(type.toString(16), 8, '0')}>`;        
        } 
    }
};