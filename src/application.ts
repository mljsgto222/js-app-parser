import { Manifest } from "./android/manifest";
import { PList, parsePlist } from "./ios/plist-parse";
import { Resource } from "./android/resource";
import { parsePNG } from "./ios/png-parse";
const jszip = require('jszip');

const MANIFEST_FILE_NAME = 'AndroidManifest.xml';
const RESOURCES_FILE_NAME = 'resources.arsc';

const TYPE_MAP: {[key in string]: string} = {
    '.jpe': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png'
}

function getType(filename: string): string {
    const extendIndex = filename.lastIndexOf('.');
    if (extendIndex >= 0) {
        return TYPE_MAP[filename.slice(extendIndex)];
    } else {
        return '';
    }
}

export class Application {
    versionCode: string;
    versionName: string;
    package: string;
    icon?: string;
    iconSteam?: Uint8Array;
    name: string;
    platform: string;

    static loadAsync(fileData: String|ArrayBuffer|Uint8Array|Buffer|Blob|Promise<String|ArrayBuffer|Uint8Array|Buffer|Blob>, options?: {
        base64?: boolean,
        checkCRC32?: boolean,
        optimizedBinaryString?: boolean,
        createFolders?: boolean,
        decodeFileName?: Function
    }): Promise<Application> {
        return jszip.loadAsync(fileData, options).then((zip: any) => {
            if (zip.files[RESOURCES_FILE_NAME] && zip.files[MANIFEST_FILE_NAME]) {
                return Application.parseAndroid(zip);
            } else {
                const names = Object.getOwnPropertyNames(zip.files);
                for (let i = 0; i < names.length; i++) {
                    if (/^Payload\/(?:.*)\.app\/Info.plist$/.test(names[i])) {
                        const infoFile = zip.files[names[i]];
                        return Application.parseIOS(infoFile, zip);
                    }
                }
                throw 'unknown zip file';
            }
        });
    }

    private static parseAndroid(zip: any): Promise<Application> {
        return zip.files[RESOURCES_FILE_NAME].async('uint8array').then((result: Uint8Array) => {
            return new Resource(result);
        }).then((resource: Resource) => {
            return zip.files[MANIFEST_FILE_NAME].async('uint8array').then((result: Uint8Array) => {
                return new Manifest(result, resource);
            });
        }).then((manifest: Manifest) => {
            const application = new Application(manifest);
            if (application.icon && zip.files[application.icon]) {
                return zip.files[application.icon].async('uint8array').then((result: Uint8Array) => {
                    application.iconSteam = result;
                    return application;
                });
            } else {
                return application;
            }
        });
    }

    private static parseIOS(infoFile: any, zip: any): Promise<Application> {
        return infoFile.async('uint8array').then((result: Uint8Array) => {
            return parsePlist(result);
        }).then((plist: PList) => {
            let application = new Application(plist);
            const names = Object.getOwnPropertyNames(zip.files);
            if (application.icon) {
                let icon;
                for (let i = 0; i < names.length; i++) {
                    if (names[i].indexOf(application.icon!) >= 0) {
                        icon = zip.files[names[i]];
                    }
                }
                if (icon) {
                    return icon.async('uint8array').then((result: Uint8Array) => {
                        application.iconSteam = parsePNG(result);
                        return application
                    });
                }
            }
            return application;
        });
    }

    private constructor(info: Manifest | PList) {
        if(info instanceof Manifest) {
            this.icon = info.tagMap['application']['icon'];
            this.name = info.tagMap['application']['label'];
            this.package = info.tagMap['manifest']['package'];
            this.versionCode = info.tagMap['manifest']['versionCode'];
            this.versionName = info.tagMap['manifest']['versionName'];
            this.platform = info.platform;
        } else {
            this.name = info.info['CFBundleDisplayName'];
            this.package = info.info['CFBundleIdentifier'];
            this.versionCode = info.info['CFBundleVersion'];
            this.versionName = info.info['CFBundleShortVersionString'];
            this.platform = info.platform;
            if(info.info['CFBundleIcons']) {
                const icons = info.info['CFBundleIcons']['CFBundlePrimaryIcon']['CFBundleIconFiles'];
                if (icons) {
                    this.icon = icons[icons.length - 1];
                }
            }
        }
    }
}