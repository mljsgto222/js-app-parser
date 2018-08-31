import { Tools } from "./tools";


export class AttributeData {
    name: string = '';
    nameSpaceUri: string = '';
    valueString: string = '';
    type: number = 0;
    data: string = '';

    static getSize() {
        return 4 * 5;
    }

    constructor(xmlBytes: Uint8Array, stringList: Array<string>) {
        for(let i = 0; i < 5; i ++) {
            let valueIndex = Tools.toInt(xmlBytes.slice(i * 4, i * 4 + 4));
            if (valueIndex >= 0) {
                switch (i) {
                    case 0:
                        this.nameSpaceUri = stringList[valueIndex];
                        break;
                    case 1:
                        this.name = stringList[valueIndex];
                        break;
                    case 2:
                        this.valueString = stringList[valueIndex];
                        break;
                    case 3:
                        valueIndex = valueIndex >> 24;
                        this.type = valueIndex;
                        break;
                    case 4:
                        this.data = Tools.getAttributeData(valueIndex, this.type, stringList);
                        break;
                    default:
                        break;
                }
            }
        }
    }
}