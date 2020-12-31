"use strict";

const fileio = require('./file-io');
const fs = require('fs');
const { nanoid } = require('nanoid');
const path = require('path');
const chalk = require('chalk');
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const querystring = require('querystring');

function runCssCacheBuster(directory, performUpdate, ownerExtensions, includeExternalCss = false) {
    const cssOwnerFiles = fileio.walk(directory, ownerExtensions);
    //const cssOwnerFiles = ['C:\\Users\\thumb\\Documents\\programming\\node\\cache-buster\\dist\\index.html'];

    const fileInfo = getCssInfo(cssOwnerFiles, performUpdate, ownerExtensions, includeExternalCss);
    const allCssFileDuplicates = [];

    fileInfo.forEach(fi => {
        let fileContents = fileio.readFile(fi.filename);
        const oldFileContents = fileContents;

        fi.cssInfo.forEach(ci => {
            const oldHref = `${ci.cssFile}?${ci.queryString}`;
            const newHref = `${ci.cssFile}?${ci.newQueryString}`;

            fileContents = fileContents.replace(oldHref, newHref);

            if (oldFileContents === fileContents) {
                console.log('file contents did not change');
            }

            if (performUpdate && oldFileContents !== fileContents) {
                fileio.writeFile(fi.filename, fileContents);
                fi.written = true;
            }
        });
    });

    showCssFileUpdateInfo(fileInfo, performUpdate);
}

function showCssFileUpdateInfo(fileInfo, performUpdate) {
    let fileColor;
    let cssFileColor;
    let headingColor;
    let warningColor = chalk.bold.yellow;

    let uniqueCssFiles = []

    if (performUpdate) {
        headingColor = chalk.black.bgWhite;
        fileColor = chalk.bold.green;
        cssFileColor = chalk.green;
        console.log(headingColor('These CSS files were updated'));
    } else {
        headingColor = chalk.black.bgWhite;
        fileColor = chalk.bold.cyan;
        cssFileColor = chalk.cyan;
        console.log(headingColor('These CSS files were found -- no update performed (use --update option to update)'));
    }
    fileInfo.forEach(fi => {
        let msg;
        if (performUpdate && 'written' in fi && fi.written || !performUpdate) {
            msg = `CSS parent file: ${fi.filename}`;
            console.log(fileColor(msg));
            uniqueCssFiles = []
            fi.cssInfo.forEach(ci => {
                if (uniqueCssFiles.find(val => val == ci.cssFile.toLowerCase())) {
                    msg = `  CSS file: ${ci.cssFile} (multiple occurrences)`;
                    console.log(warningColor(msg));
                } else {
                    msg = `  CSS file: ${ci.cssFile}`;
                    uniqueCssFiles.push(ci.cssFile);
                    console.log(cssFileColor(msg));
                }

                if (ci.replacedOccurrences == 1) {} else {}
            });
        }
    });
}

function getCssInfo(cssOwnerFiles, performUpdate, ownerExtensions, includeExternalCss = false) {
    const allFileInfo = [];

    cssOwnerFiles.forEach(filename => {
        const fileInfo = {}
        fileInfo.filename = filename;
        fileInfo.cssInfo = [];

        let fileContents = fileio.readFile(filename);
        const dom = new JSDOM(fileContents);

        const ls = dom.window.document.querySelectorAll('link');
        ls.forEach(link => {
            if (link.rel.toLowerCase() == 'stylesheet') {
                const cssInfoObject = {}
                cssInfoObject.href = link.href;
                cssInfoObject.cssFile = cssInfoObject.href.replace(/\?.*/, '');
                cssInfoObject.queryString = (cssInfoObject.href.includes('?')) ? cssInfoObject.href.replace(/^.*\?/, '') : '';
                cssInfoObject.replacedOccurrences = 0;

                if (cssInfoObject.cssFile.toLowerCase().endsWith('.css')) {
                    if (includeExternalCss || !includeExternalCss && !cssInfoObject.cssFile.toLowerCase().startsWith('http')) {
                        fileInfo.cssInfo.push(cssInfoObject);
                        const qs = querystring.parse(cssInfoObject.queryString);
                        qs.v = nanoid();
                        cssInfoObject.newQueryString = querystring.stringify(qs);
                    }
                };
            };
        });
        allFileInfo.push(fileInfo);
    });

    return allFileInfo;
}

function runAutoBuster(directory, performUpdate, ownerExtensions, includeExternalCss) {
    runCssCacheBuster(directory, performUpdate, ownerExtensions, includeExternalCss)
}

if (require.main === module) {
    runCssCacheBuster('dist', performUpdate = true, ownerExtensions = ['.html', '.aspx', '.cshtml'], includeExternalCss = false);
} else {
    module.exports = {
        runAutoBuster,
        getCssInfo
    }
}