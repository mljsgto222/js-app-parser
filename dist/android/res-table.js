"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tools_1 = require("./tools");
var ResTable = /** @class */ (function () {
    function ResTable(xmlBytes) {
        this.size = tools_1.Tools.toInt(xmlBytes.slice(2, 4));
        this.resourceSize = tools_1.Tools.toInt(xmlBytes.slice(4, 8));
        this.packageCount = tools_1.Tools.toInt(xmlBytes.slice(8, 12));
    }
    ResTable.getSize = function () {
        return 12;
    };
    return ResTable;
}());
exports.ResTable = ResTable;
