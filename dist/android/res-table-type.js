"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var res_table_config_1 = require("./res-table-config");
var res_table_entry_1 = require("./res-table-entry");
var res_table_map_entry_1 = require("./res-table-map-entry");
var res_table_map_1 = require("./res-table-map");
var res_value_1 = require("./res-value");
var tools_1 = require("./tools");
var ResTableType = /** @class */ (function () {
    function ResTableType(xmlBytes, nameList, typeList, stringList) {
        var _this = this;
        //跳过头和头大小
        this.size = tools_1.Tools.toInt(xmlBytes.slice(4, 8));
        this.typeId = xmlBytes[8];
        this.typeName = nameList[this.typeId - 1];
        //跳过备用字段
        this.entriesCount = tools_1.Tools.toInt(xmlBytes.slice(12, 16));
        var entriesStartOffset = tools_1.Tools.toInt(xmlBytes.slice(16, 20));
        this.resTableConfig = new res_table_config_1.ResTableConfig(xmlBytes.slice(20, 20 + res_table_config_1.ResTableConfig.getSize()));
        var offset = 20 + this.resTableConfig.size;
        this.entityOffsets = [];
        while (this.entityOffsets.length < this.entriesCount) {
            var typeValue = tools_1.Tools.toInt(xmlBytes.slice(offset, offset + 4));
            offset += 4;
            this.entityOffsets.push(typeValue);
        }
        this.resEntries = [];
        offset = entriesStartOffset;
        this.entityOffsets.forEach(function (entityOffset) {
            var entry = null;
            var _offset = offset + entityOffset;
            if (entityOffset >= 0) {
                entry = new res_table_entry_1.ResTableEntry(xmlBytes.slice(_offset, _offset + res_table_entry_1.ResTableEntry.getSize()), nameList);
                if (entry.flags === 1) {
                    var mapEntry = new res_table_map_entry_1.ResTableMapEntry(xmlBytes.slice(_offset, _offset + res_table_map_entry_1.ResTableMapEntry.getSize()), nameList);
                    var start = _offset + res_table_map_entry_1.ResTableMapEntry.getSize();
                    var resMaps = [];
                    while (resMaps.length < mapEntry.count) {
                        var resMap = new res_table_map_1.ResTableMap(xmlBytes.slice(start, start + res_table_map_1.ResTableMap.getSize()), stringList);
                        start += res_table_map_1.ResTableMap.getSize();
                        resMaps.push(resMap);
                    }
                    mapEntry.data = resMaps;
                    entry = mapEntry;
                }
                else {
                    var start = _offset + res_table_entry_1.ResTableEntry.getSize();
                    entry.data = new res_value_1.ResValue(xmlBytes.slice(start, start + res_value_1.ResValue.getSize()), stringList);
                }
            }
            _this.resEntries.push(entry);
        });
    }
    return ResTableType;
}());
exports.ResTableType = ResTableType;
