import { ResTableConfig } from './res-table-config';
import { ResTableEntry } from './res-table-entry';
import { ResTableMapEntry } from './res-table-map-entry';
import { ResTableMap } from './res-table-map';
import { ResValue } from './res-value';
import { Tools } from './tools';

export class ResTableType {
    size: number;
    typeId: number;
    typeName: string;
    entriesCount: number;
    resTableConfig: ResTableConfig;
    entityOffsets: Array<number>;
    resEntries: Array<ResTableEntry|null>;


    constructor(xmlBytes: Uint8Array, nameList: Array<string>, typeList: Array<string>, stringList: Array<string>) {
        //跳过头和头大小
        this.size = Tools.toInt(xmlBytes.slice(4, 8));
        this.typeId = xmlBytes[8];
        this.typeName = nameList[this.typeId - 1];
        //跳过备用字段
        this.entriesCount = Tools.toInt(xmlBytes.slice(12, 16));
        const entriesStartOffset = Tools.toInt(xmlBytes.slice(16, 20));
        this.resTableConfig = new ResTableConfig(xmlBytes.slice(20, 20 + ResTableConfig.getSize()));
        let offset = 20 + this.resTableConfig.size;

        this.entityOffsets = [];
        while (this.entityOffsets.length < this.entriesCount) {
            const typeValue = Tools.toInt(xmlBytes.slice(offset, offset + 4));
            offset += 4;
            this.entityOffsets.push(typeValue);
        }
        this.resEntries = [];
        offset = entriesStartOffset;
        this.entityOffsets.forEach(entityOffset => {
            let entry = null;
            const _offset = offset + entityOffset;
            if (entityOffset >= 0) {
                entry = new ResTableEntry(xmlBytes.slice(_offset, _offset + ResTableEntry.getSize()), nameList);
                if (entry.flags === 1) {
                    const mapEntry = new ResTableMapEntry(xmlBytes.slice(_offset, _offset + ResTableMapEntry.getSize()), nameList);
                    let start = _offset + ResTableMapEntry.getSize();
                    const resMaps = [];
                    while (resMaps.length < mapEntry.count) {
                        const resMap = new ResTableMap(xmlBytes.slice(start, start + ResTableMap.getSize()), stringList);
                        start += ResTableMap.getSize();
                        resMaps.push(resMap);
                    }
                    mapEntry.data = resMaps;
                    entry = mapEntry;
                } else {
                    let start = _offset + ResTableEntry.getSize();
                    entry.data = new ResValue(xmlBytes.slice(start, start + ResValue.getSize()), stringList);
                }
            }
            this.resEntries.push(entry);
        });
    }
}