import { Resource } from './resource';
export declare class Manifest {
    platform: string;
    tagMap: {
        [key in string]: {
            [key in string]: string;
        };
    };
    constructor(xmlBytes: Uint8Array, resource: Resource);
}
