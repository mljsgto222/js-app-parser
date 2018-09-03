import { StringBlock } from './string-block';
import { ResourceChunk } from './resource-chunk';
import { StartNamespaceChunk } from './start-namespace-chunk';
import { EndNamespaceChunk } from './end-namespace-chunk';
import { StartTagChunk } from './start-tag-chunk';
import { EndTagChunk } from './end-tag-chunk';
import { Resource } from './resource';
import { TextChunk } from './text-chunk';
import { Tools } from './tools';
import { ResValue } from './res-value';


const CHUNK_START_OFFSET = 8;

export class Manifest {
    platform = 'android';
    tagMap: {[ key in string]: {[key in string]: string}};

    constructor(xmlBytes: Uint8Array, resource: Resource) {
        let offset = CHUNK_START_OFFSET;
        const stringBlock = new StringBlock(xmlBytes.slice(offset));
        offset += stringBlock.size;
        const resourceChunk = new ResourceChunk(xmlBytes.slice(offset));
        offset += resourceChunk.size;
        this.tagMap = {};
        while (offset < xmlBytes.length) {
            const chunkType = Tools.toInt(xmlBytes.slice(offset, offset + 4));
            switch(chunkType) {
                case StartNamespaceChunk.TYPE:
                    const startNamespace = new StartNamespaceChunk(xmlBytes.slice(offset), stringBlock.stringList);
                    offset += startNamespace.size;
                    // this.namespaces.push(startNamespace);
                    break;
                case StartTagChunk.TYPE:
                    const startTag = new StartTagChunk(xmlBytes.slice(offset), stringBlock.stringList);
                    offset += startTag.size;
                    const tagName = startTag.tagName;
                    if (!this.tagMap[tagName]) {
                        this.tagMap[tagName] = {};
                    }
                    startTag.attrs.forEach(attr => {
                        if(attr.type === 1 && attr.data.indexOf('@android') < 0) {
                            let hex = attr.data.split('@')[1];
                            const typeId = hex.slice(2, 4);
                            const index = parseInt(hex.slice(4), 16);
                            if (resource.map[typeId]) {
                                const data: ResValue | any = resource.map[typeId][index]!.data;
                                if (data instanceof ResValue) {
                                    attr.data = data.data;
                                }
                            }
                        }
                        this.tagMap[tagName][attr.name] = attr.data || attr.valueString;
                    });
                    break;
                case EndNamespaceChunk.TYPE:
                    const endNamespace = new EndNamespaceChunk(xmlBytes.slice(offset), stringBlock.stringList);
                    offset += endNamespace.size;
                    break;
                case EndTagChunk.TYPE:
                    const endTag = new EndTagChunk(xmlBytes.slice(offset), stringBlock.stringList);
                    offset += endTag.size;
                    break;
                case TextChunk.TYPE:
                    const text = new TextChunk(xmlBytes.slice(offset), stringBlock.stringList)
                    offset += text.size;
                    break;
                default:
                    break;
            }
        }
    }
}