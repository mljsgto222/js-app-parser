import { Tools } from "./tools";


export class ResTable {
    size: number;
    resourceSize: number;
    packageCount: number;

    static getSize(): number {
        return 12;
    }

    constructor(xmlBytes: Uint8Array) {
        this.size = Tools.toInt(xmlBytes.slice(2, 4))
        this.resourceSize = Tools.toInt(xmlBytes.slice(4, 8));
        this.packageCount = Tools.toInt(xmlBytes.slice(8, 12));
    }
}