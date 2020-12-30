var assert = require('chai').assert;
var expect = require('chai').expect;

const cacheBust = require('../css-utes-members/auto-cache-buster');

describe('test css cache bust', function() {
    it('should check css files read', function() {
        const directory = 'test-input-read-only'
        const performUpdate = false;
        const ownerExtensions = ['.html'];
        const includeExternalCss = false;

        const fileInfo = cacheBust.getCssInfo(directory, performUpdate, ownerExtensions, includeExternalCss);
        assert.isNotNull(fileInfo, 'fileInfo is not null');

        const cssInfo = fileInfo[0].cssInfo;
        assert.strictEqual(cssInfo.length, 3, 'cssInfo has three members');

        assert.strictEqual(fileInfo[0].cssInfo[0].cssFile, './assets/css/global.min.css');
        assert.strictEqual(fileInfo[0].cssInfo[1].cssFile, './assets/css/main.css');
        assert.strictEqual(fileInfo[0].cssInfo[2].cssFile, './assets/css/other.css');
    });
});

describe('test css cache bust', function() {
    it('should check css files read', function() {
        const directory = 'test-input-read-only'
        const performUpdate = false;
        const ownerExtensions = ['.html', '.cshtml'];
        const includeExternalCss = false;

        const fileInfo = cacheBust.getCssInfo(directory, performUpdate, ownerExtensions, includeExternalCss);
        assert.isNotNull(fileInfo, 'fileInfo is not null');

        assert.strictEqual(fileInfo[1].filename, 'test-input-read-only\\_layout.cshtml');
        assert.strictEqual(fileInfo[0].filename, 'test-input-read-only\\index.html');
    });
});