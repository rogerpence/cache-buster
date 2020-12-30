var assert = require('chai').assert;
var expect = require('chai').expect;

const cacheBust = require('../css-utes-members/auto-cache-buster');

function getCssFileNames(fileInfo) {
    cssFiles = [];

    fileInfo.forEach(fi => {
        fi.cssInfo.forEach(ci => {
            cssFiles.push(ci.cssFile);
        })
    });

    return cssFiles;
}

describe('test css cache bust', function() {
    it('should confirm exact CSS files read', function() {

        const ownerFiles = [
            `${__dirname}\\test-input-read-only\\index.html`
        ];

        const performUpdate = false;
        const ownerExtensions = ['.html'];
        const includeExternalCss = false;

        const fileInfo = cacheBust.getCssInfo(ownerFiles, performUpdate, ownerExtensions, includeExternalCss);
        assert.isNotNull(fileInfo, 'fileInfo is not null');

        const cssInfo = fileInfo[0].cssInfo;
        assert.strictEqual(cssInfo.length, 3, 'cssInfo has three members');

        const cssFiles = getCssFileNames(fileInfo);

        assert.isDefined(cssFiles.find(element => element == './assets/css/global.min.css'));
        assert.isDefined(cssFiles.find(element => element == './assets/css/main.css'));
        assert.isDefined(cssFiles.find(element => element == './assets/css/other.css'));
    });
});

describe('test css cache bust', function() {
    it('test owner files read', function() {
        const dd = __dirname;

        const ownerFiles = [
            `${__dirname}\\test-input-read-only\\index.html`,
            `${__dirname}\\test-input-read-only\\_layout.cshtml`
        ];
        const performUpdate = false;
        const ownerExtensions = ['.html', '.cshtml'];
        const includeExternalCss = false;

        const fileInfo = cacheBust.getCssInfo(ownerFiles, performUpdate, ownerExtensions, includeExternalCss);
        assert.isNotNull(fileInfo, 'fileInfo is not null');

        assert.strictEqual(fileInfo[1].filename, `${__dirname}\\test-input-read-only\\_layout.cshtml`);
        assert.strictEqual(fileInfo[0].filename, `${__dirname}\\test-input-read-only\\index.html`);
    });
});

describe('test reading external css files', function() {
    it('should read four CSS files', function() {
        const ownerFiles = [
            `${__dirname}\\test-input-read-only\\index.html`,
        ];
        const performUpdate = false;
        const ownerExtensions = ['.html', '.cshtml'];

        let includeExternalCss = true;
        let fileInfo = cacheBust.getCssInfo(ownerFiles, performUpdate, ownerExtensions, includeExternalCss);
        assert.isNotNull(fileInfo, 'fileInfo is not null');
        assert.strictEqual(fileInfo[0].cssInfo.length, 4);
    });

    it('should read three CSS files', function() {
        const ownerFiles = [
            `${__dirname}\\test-input-read-only\\index.html`,
        ];
        const performUpdate = false;
        const ownerExtensions = ['.html', '.cshtml'];

        let includeExternalCss = false;
        let fileInfo = cacheBust.getCssInfo(ownerFiles, performUpdate, ownerExtensions, includeExternalCss);
        assert.isNotNull(fileInfo, 'fileInfo is not null');
        assert.strictEqual(fileInfo[0].cssInfo.length, 3);
    });

});