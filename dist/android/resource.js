"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_block_1 = require("./string-block");
var res_table_package_1 = require("./res-table-package");
var res_table_1 = require("./res-table");
var Resource = /** @class */ (function () {
    function Resource(xmlBytes) {
        var start = 0;
        var resTable = new res_table_1.ResTable(xmlBytes);
        start += res_table_1.ResTable.getSize();
        var stringBlock = new string_block_1.StringBlock(xmlBytes.slice(start));
        start += stringBlock.size;
        var tablePackage = new res_table_package_1.ResTablePackage(xmlBytes.slice(start), stringBlock.stringList);
        this.map = tablePackage.tableMap;
    }
    return Resource;
}());
exports.Resource = Resource;
