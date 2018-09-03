"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var manifest_1 = require("./android/manifest");
var plist_parse_1 = require("./ios/plist-parse");
var resource_1 = require("./android/resource");
var png_parse_1 = require("./ios/png-parse");
var jszip = require('jszip');
var MANIFEST_FILE_NAME = 'AndroidManifest.xml';
var RESOURCES_FILE_NAME = 'resources.arsc';
var TYPE_MAP = {
    '.jpe': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.jpg': 'image/jpeg',
    '.png': 'image/png'
};
function getType(filename) {
    var extendIndex = filename.lastIndexOf('.');
    if (extendIndex >= 0) {
        return TYPE_MAP[filename.slice(extendIndex)];
    }
    else {
        return '';
    }
}
var Application = /** @class */ (function () {
    function Application(info) {
        if (info instanceof manifest_1.Manifest) {
            this.icon = info.tagMap['application']['icon'];
            this.name = info.tagMap['application']['label'];
            this.package = info.tagMap['manifest']['package'];
            this.versionCode = info.tagMap['manifest']['versionCode'];
            this.versionName = info.tagMap['manifest']['versionName'];
            this.platform = info.platform;
        }
        else {
            this.name = info.info['CFBundleDisplayName'];
            this.package = info.info['CFBundleIdentifier'];
            this.versionCode = info.info['CFBundleVersion'];
            this.versionName = info.info['CFBundleShortVersionString'];
            this.platform = info.platform;
            if (info.info['CFBundleIcons']) {
                var icons = info.info['CFBundleIcons']['CFBundlePrimaryIcon']['CFBundleIconFiles'];
                if (icons) {
                    this.icon = icons[icons.length - 1];
                }
            }
        }
    }
    Application.loadAsync = function (fileData, options) {
        return jszip.loadAsync(fileData, options).then(function (zip) {
            if (zip.files[RESOURCES_FILE_NAME] && zip.files[MANIFEST_FILE_NAME]) {
                return Application.parseAndroid(zip);
            }
            else {
                var names = Object.getOwnPropertyNames(zip.files);
                for (var i = 0; i < names.length; i++) {
                    if (/^Payload\/(?:.*)\.app\/Info.plist$/.test(names[i])) {
                        var infoFile = zip.files[names[i]];
                        return Application.parseIOS(infoFile, zip);
                    }
                }
                throw 'unknown zip file';
            }
        });
    };
    Application.parseAndroid = function (zip) {
        return zip.files[RESOURCES_FILE_NAME].async('uint8array').then(function (result) {
            return new resource_1.Resource(result);
        }).then(function (resource) {
            return zip.files[MANIFEST_FILE_NAME].async('uint8array').then(function (result) {
                return new manifest_1.Manifest(result, resource);
            });
        }).then(function (manifest) {
            var application = new Application(manifest);
            if (application.icon && zip.files[application.icon]) {
                return zip.files[application.icon].async('uint8array').then(function (result) {
                    application.iconSteam = result;
                    return application;
                });
            }
            else {
                return application;
            }
        });
    };
    Application.parseIOS = function (infoFile, zip) {
        return infoFile.async('uint8array').then(function (result) {
            return plist_parse_1.parsePlist(result);
        }).then(function (plist) {
            var application = new Application(plist);
            var names = Object.getOwnPropertyNames(zip.files);
            if (application.icon) {
                var icon = void 0;
                for (var i = 0; i < names.length; i++) {
                    if (names[i].indexOf(application.icon) >= 0) {
                        icon = zip.files[names[i]];
                    }
                }
                if (icon) {
                    return icon.async('uint8array').then(function (result) {
                        application.iconSteam = png_parse_1.parsePNG(result);
                        return application;
                    });
                }
            }
            return application;
        });
    };
    return Application;
}());
exports.Application = Application;
