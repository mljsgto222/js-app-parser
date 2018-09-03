"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_block_1 = require("./string-block");
var res_table_spec_type_1 = require("./res-table-spec-type");
var res_table_type_1 = require("./res-table-type");
var tools_1 = require("./tools");
var RES_TYPE_TYPE_TABLE = 0x0201;
var RES_TYPE_TYPE_SPCE = 0x0202;
var ResTablePackage = /** @class */ (function () {
    function ResTablePackage(xmlBytes, stringList) {
        var _this = this;
        // tableSpecTypes: Array<ResTableSpecType>;
        // tableTypes: Array<ResTableType>;
        this.destity = 0;
        //跳过头
        this.headerSize = tools_1.Tools.toShort(xmlBytes.slice(2, 4));
        this.size = tools_1.Tools.toInt(xmlBytes.slice(4, 8));
        this.packageId = tools_1.Tools.toInt(xmlBytes.slice(8, 12));
        this.packageName = tools_1.Tools.getDecoder(tools_1.Tools.UTF8_FLAG).decode(xmlBytes.slice(12, 12 + 256));
        var stringPoolOffset = tools_1.Tools.toInt(xmlBytes.slice(268, 272));
        this.lastPublicType = tools_1.Tools.toInt(xmlBytes.slice(272, 276));
        var keyStringPoolOffset = tools_1.Tools.toInt(xmlBytes.slice(276, 280));
        this.lastPublicKey = tools_1.Tools.toInt(xmlBytes.slice(280, 284));
        var typeBlock = new string_block_1.StringBlock(xmlBytes.slice(stringPoolOffset));
        var nameBlock = new string_block_1.StringBlock(xmlBytes.slice(keyStringPoolOffset));
        var offset = this.headerSize + typeBlock.size + nameBlock.size;
        // this.tableSpecTypes = [];
        // this.tableTypes = [];
        this.tableMap = {};
        this.tableMapCache = {};
        var _loop_1 = function () {
            var header = tools_1.Tools.toInt(xmlBytes.slice(offset, offset + 2));
            switch (header) {
                case RES_TYPE_TYPE_SPCE:
                    var tableSpecType = new res_table_spec_type_1.ResTableSpecType(xmlBytes.slice(offset), nameBlock.stringList);
                    offset += tableSpecType.size;
                    // this.tableSpecTypes.push(tableSpecType);
                    break;
                case RES_TYPE_TYPE_TABLE:
                    var tableType_1 = new res_table_type_1.ResTableType(xmlBytes.slice(offset), nameBlock.stringList, typeBlock.stringList, stringList);
                    offset += tableType_1.size;
                    // this.tableTypes.push(tableType);
                    var typeId_1 = tools_1.Tools.paddingStart(tableType_1.typeId.toString(16), 2, '0');
                    if (!this_1.tableMap[typeId_1]) {
                        this_1.tableMap[typeId_1] = [];
                    }
                    tableType_1.resEntries.forEach(function (entry, index) {
                        var resTableType = _this.tableMap[typeId_1];
                        if (resTableType.length <= index) {
                            resTableType.push(null);
                        }
                        if (entry) {
                            var key = typeId_1 + entry.name;
                            if (!_this.tableMapCache[key]) {
                                _this.tableMapCache[key] = {
                                    weight: tableType_1.resTableConfig.density
                                };
                                resTableType[index] = entry;
                            }
                            else {
                                if (tableType_1.resTableConfig.density > _this.tableMapCache[key].weight) {
                                    resTableType[index] = entry;
                                }
                            }
                        }
                    });
                    break;
                default:
                    break;
            }
        };
        var this_1 = this;
        while (offset < this.size) {
            _loop_1();
        }
    }
    return ResTablePackage;
}());
exports.ResTablePackage = ResTablePackage;
