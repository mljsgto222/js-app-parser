import { StringBlock } from './string-block';
import { ResTablePackage } from './res-table-package';
import { ResTable } from './res-table';
import { ResTableEntry } from './res-table-entry';


export class Resource {
    map: {[key in string]: Array<ResTableEntry|null>};

    constructor(xmlBytes: Uint8Array) {
        let start = 0;
        const resTable = new ResTable(xmlBytes);
        start += ResTable.getSize();
        const stringBlock = new StringBlock(xmlBytes.slice(start));
        start += stringBlock.size;
        const tablePackage = new ResTablePackage(xmlBytes.slice(start), stringBlock.stringList);
        this.map = tablePackage.tableMap;
    }
}