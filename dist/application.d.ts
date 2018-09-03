/// <reference types="node" />
export declare class Application {
    versionCode: string;
    versionName: string;
    package: string;
    icon?: string;
    iconSteam?: Uint8Array;
    name: string;
    platform: string;
    static loadAsync(fileData: String | ArrayBuffer | Uint8Array | Buffer | Blob | Promise<String | ArrayBuffer | Uint8Array | Buffer | Blob>, options?: {
        base64?: boolean;
        checkCRC32?: boolean;
        optimizedBinaryString?: boolean;
        createFolders?: boolean;
        decodeFileName?: Function;
    }): Promise<Application>;
    private static parseAndroid;
    private static parseIOS;
    private constructor();
}
