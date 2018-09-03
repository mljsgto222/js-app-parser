import { Tools } from "./tools";

const Encoding = require('text-encoding');
const pako = require('pako');
const CRC32 = require('crc-32');

const PNG_HEADER = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const asciiDecoder = new Encoding.TextDecoder('ascii');
const asciiEncode = new Encoding.TextEncoder();

const CHUNK_TYPE_IDAT = 'IDAT';
const CHUNK_TYPE_IHDR = 'IHDR';
const CHUNK_TYPE_CGBI = 'CgBI';
const CHUNK_TYPE_IEND = 'IEND';

export function parsePNG(pngBytes: Uint8Array): Uint8Array {
    const header = pngBytes.slice(0, 8);
    if (Tools.toHex(header) !== Tools.toHex(PNG_HEADER)) {
        throw 'invalid png file';
    }

    let newPngBytes = pngBytes.slice(0, 8);
    let idatAcc: Uint8Array = new Uint8Array([]);
    let breakLoop = false;
    let foundCgBI = false;
    let chunkPos = newPngBytes.length;
    let width = 0;
    let height = 0;
    while (chunkPos < pngBytes.length) {
        let skip = false;

        let chunkLength = parseInt(Tools.toHex(pngBytes.slice(chunkPos, chunkPos + 4)), 16);
        let chunkType = pngBytes.slice(chunkPos + 4, chunkPos + 8);
        let chunkData = pngBytes.slice(chunkPos + 8, chunkPos + 8 + chunkLength);
        const chunkCRCBytes = pngBytes.slice(chunkPos + chunkLength + 8, chunkPos + chunkLength + 12);
        let chunkCRC = parseInt(Tools.toHex(chunkCRCBytes), 16);
        chunkPos += chunkLength + 12;
        switch (asciiDecoder.decode(chunkType)) {
            case CHUNK_TYPE_IHDR:
                width = parseInt(Tools.toHex(chunkData.slice(0, 4)), 16);
                height = parseInt(Tools.toHex(chunkData.slice(4, 8)), 16);
                break;
            case CHUNK_TYPE_IDAT:
                idatAcc = Tools.concatBytes(idatAcc, chunkData);
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
                const newData = [];
                for (let h = 0; h < height; h ++) {
                    let i: number = newData.length;
                    newData.push(chunkData[i]);
                    for (let w = 0; w < width; w ++) {
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
            newPngBytes = Tools.concatBytes(newPngBytes, Tools.intToBytes(chunkLength));
            newPngBytes = Tools.concatBytes(newPngBytes, chunkType);
            if (chunkLength > 0) {
                newPngBytes = Tools.concatBytes(newPngBytes, chunkData);
            }
            newPngBytes = Tools.concatBytes(newPngBytes, Tools.intToBytes(chunkCRC));
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