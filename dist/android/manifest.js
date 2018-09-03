"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var string_block_1 = require("./string-block");
var resource_chunk_1 = require("./resource-chunk");
var start_namespace_chunk_1 = require("./start-namespace-chunk");
var end_namespace_chunk_1 = require("./end-namespace-chunk");
var start_tag_chunk_1 = require("./start-tag-chunk");
var end_tag_chunk_1 = require("./end-tag-chunk");
var text_chunk_1 = require("./text-chunk");
var tools_1 = require("./tools");
var res_value_1 = require("./res-value");
var CHUNK_START_OFFSET = 8;
var Manifest = /** @class */ (function () {
    function Manifest(xmlBytes, resource) {
        var _this = this;
        this.platform = 'android';
        var offset = CHUNK_START_OFFSET;
        var stringBlock = new string_block_1.StringBlock(xmlBytes.slice(offset));
        offset += stringBlock.size;
        var resourceChunk = new resource_chunk_1.ResourceChunk(xmlBytes.slice(offset));
        offset += resourceChunk.size;
        this.tagMap = {};
        var _loop_1 = function () {
            var chunkType = tools_1.Tools.toInt(xmlBytes.slice(offset, offset + 4));
            switch (chunkType) {
                case start_namespace_chunk_1.StartNamespaceChunk.TYPE:
                    var startNamespace = new start_namespace_chunk_1.StartNamespaceChunk(xmlBytes.slice(offset), stringBlock.stringList);
                    offset += startNamespace.size;
                    // this.namespaces.push(startNamespace);
                    break;
                case start_tag_chunk_1.StartTagChunk.TYPE:
                    var startTag = new start_tag_chunk_1.StartTagChunk(xmlBytes.slice(offset), stringBlock.stringList);
                    offset += startTag.size;
                    var tagName_1 = startTag.tagName;
                    if (!this_1.tagMap[tagName_1]) {
                        this_1.tagMap[tagName_1] = {};
                    }
                    startTag.attrs.forEach(function (attr) {
                        if (attr.type === 1 && attr.data.indexOf('@android') < 0) {
                            var hex = attr.data.split('@')[1];
                            var typeId = hex.slice(2, 4);
                            var index = parseInt(hex.slice(4), 16);
                            if (resource.map[typeId]) {
                                var data = resource.map[typeId][index].data;
                                if (data instanceof res_value_1.ResValue) {
                                    attr.data = data.data;
                                }
                            }
                        }
                        _this.tagMap[tagName_1][attr.name] = attr.data || attr.valueString;
                    });
                    break;
                case end_namespace_chunk_1.EndNamespaceChunk.TYPE:
                    var endNamespace = new end_namespace_chunk_1.EndNamespaceChunk(xmlBytes.slice(offset), stringBlock.stringList);
                    offset += endNamespace.size;
                    break;
                case end_tag_chunk_1.EndTagChunk.TYPE:
                    var endTag = new end_tag_chunk_1.EndTagChunk(xmlBytes.slice(offset), stringBlock.stringList);
                    offset += endTag.size;
                    break;
                case text_chunk_1.TextChunk.TYPE:
                    var text = new text_chunk_1.TextChunk(xmlBytes.slice(offset), stringBlock.stringList);
                    offset += text.size;
                    break;
                default:
                    break;
            }
        };
        var this_1 = this;
        while (offset < xmlBytes.length) {
            _loop_1();
        }
    }
    return Manifest;
}());
exports.Manifest = Manifest;
