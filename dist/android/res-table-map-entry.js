"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var res_table_entry_1 = require("./res-table-entry");
var tools_1 = require("./tools");
var ResTableMapEntry = /** @class */ (function (_super) {
    __extends(ResTableMapEntry, _super);
    function ResTableMapEntry(xmlBytes, nameList) {
        var _this = _super.call(this, xmlBytes, nameList) || this;
        _this.parent = tools_1.Tools.toInt(xmlBytes.slice(8, 12));
        _this.count = tools_1.Tools.toInt(xmlBytes.slice(12, 16));
        return _this;
    }
    ResTableMapEntry.getSize = function () {
        return 16;
    };
    return ResTableMapEntry;
}(res_table_entry_1.ResTableEntry));
exports.ResTableMapEntry = ResTableMapEntry;
