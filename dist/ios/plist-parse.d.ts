export declare function parsePlist(plistBytes: Uint8Array): PList;
export declare class PList {
    info: {
        [key in string]: string | any;
    };
    platform: string;
    constructor(info: {
        [key in string]: string | any;
    });
}
