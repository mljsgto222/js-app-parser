import { StringBlock } from './string-block';
import { ResTableSpecType } from './res-table-spec-type';
import { ResTableType } from './res-table-type';
import { ResTableEntry } from './res-table-entry';
import { Tools } from './tools';

const RES_TYPE_TYPE_TABLE = 0x0201;
const RES_TYPE_TYPE_SPCE = 0x0202;

export class ResTablePackage {
    headerSize: number;
    size: number;
    packageId: number;
    packageName: string;
    lastPublicType: number;
    lastPublicKey: number;
    tableMapCache: {[key in string]: any};
    // tableSpecTypes: Array<ResTableSpecType>;
    // tableTypes: Array<ResTableType>;
    destity: number = 0;

    tableMap: {[key in string]: Array<ResTableEntry|null>};

    constructor(xmlBytes: Uint8Array, stringList: Array<string>) {
        //跳过头
        this.headerSize = Tools.toShort(xmlBytes.slice(2, 4));
        this.size = Tools.toInt(xmlBytes.slice(4, 8));
        this.packageId = Tools.toInt(xmlBytes.slice(8, 12));
        this.packageName = Tools.getDecoder(Tools.UTF8_FLAG).decode(xmlBytes.slice(12, 12 + 256));
        const stringPoolOffset = Tools.toInt(xmlBytes.slice(268, 272));
        this.lastPublicType = Tools.toInt(xmlBytes.slice(272, 276));
        const keyStringPoolOffset = Tools.toInt(xmlBytes.slice(276, 280));
        this.lastPublicKey = Tools.toInt(xmlBytes.slice(280, 284));

        const typeBlock = new StringBlock(xmlBytes.slice(stringPoolOffset));
        const nameBlock = new StringBlock(xmlBytes.slice(keyStringPoolOffset));
        let offset = this.headerSize + typeBlock.size + nameBlock.size;
        // this.tableSpecTypes = [];
        // this.tableTypes = [];
        this.tableMap = {};
        this.tableMapCache = {};
        while(offset < this.size) {
            const header = Tools.toInt(xmlBytes.slice(offset, offset + 2));
            switch(header) {
                case RES_TYPE_TYPE_SPCE:
                    const tableSpecType = new ResTableSpecType(xmlBytes.slice(offset), nameBlock.stringList);
                    offset += tableSpecType.size;
                    // this.tableSpecTypes.push(tableSpecType);
                    break;
                case RES_TYPE_TYPE_TABLE:
                    const tableType = new ResTableType(xmlBytes.slice(offset), nameBlock.stringList, typeBlock.stringList, stringList);
                    offset += tableType.size;
                    // this.tableTypes.push(tableType);
                    const typeId = Tools.paddingStart(tableType.typeId.toString(16), 2, '0') ;
                    if (!this.tableMap[typeId]) {
                        this.tableMap[typeId] = [];
                    }
                    tableType.resEntries.forEach((entry: any, index: number) => {
                        const resTableType = this.tableMap[typeId];
                        if (resTableType.length <= index) {
                            resTableType.push(null);
                        }
                        if (entry) {
                            const key = typeId + entry.name;
                            if (!this.tableMapCache[key]) {
                                this.tableMapCache[key] = {
                                    weight: tableType.resTableConfig.density
                                } ;
                                resTableType[index] = entry;
                            } else {
                                if (tableType.resTableConfig.density > this.tableMapCache[key].weight) {
                                    resTableType[index] = entry;
                                }
                            }
                        }
                    });
                    break;
                default:
                    break;
            }
        }
    }
}