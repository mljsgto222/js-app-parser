"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var res_value_1 = require("./res-value");
var tools_1 = require("./tools");
var ResTableMap = /** @class */ (function () {
    function ResTableMap(xmlBytes, stringList) {
        this.index = tools_1.Tools.toInt(xmlBytes.slice(0, 4));
        this.value = new res_value_1.ResValue(xmlBytes.slice(4, 4 + res_value_1.ResValue.getSize()), stringList);
    }
    ResTableMap.getSize = function () {
        return 4 + res_value_1.ResValue.getSize();
    };
    return ResTableMap;
}());
exports.ResTableMap = ResTableMap;
