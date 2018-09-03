"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var AttributeData = /** @class */ (function () {
    function AttributeData(xmlBytes, stringList) {
        this.name = '';
        this.nameSpaceUri = '';
        this.valueString = '';
        this.type = 0;
        this.data = '';
        for (var i = 0; i < 5; i++) {
            var valueIndex = tools_1.Tools.toInt(xmlBytes.slice(i * 4, i * 4 + 4));
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
                        this.data = tools_1.Tools.getAttributeData(valueIndex, this.type, stringList);
                        break;
                    default:
                        break;
                }
            }
        }
    }
    AttributeData.getSize = function () {
        return 4 * 5;
    };
    return AttributeData;
}());
exports.AttributeData = AttributeData;
