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
        const cssFileDuplicates = [];
        const cssFilenamesChecked = [];

        fi.cssInfo.forEach(ci => {
            if (!cssFilenamesChecked.find(val => val == ci.cssFile.toLowerCase())) {
                cssFilenamesChecked.push(ci.cssFile.toLowerCase());
                searchForDuplicateCssFiles(fi.filename, ci.oldHRef, fileContents, cssFileDuplicates)
            }

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

        if (cssFileDuplicates.length > 0) {
            allCssFileDuplicates.push(cssFileDuplicates)
        }
    });

    // console.table(fileInfo);

    fileInfo.forEach(fi => {
        console.table(fi.cssInfo);
    });
    showCssFileUpdateInfo(fileInfo, performUpdate);
    showDuplicatesFound(allCssFileDuplicates);
}

function showCssFileUpdateInfo(fileInfo, performUpdate) {
    let fileColor;
    let cssFileColor;
    let headingColor;
    if (performUpdate) {
        headingColor = chalk.black.bgWhite;
        fileColor = chalk.bold.green;
        cssFileColor = chalk.green;
        console.log(headingColor('These CSS files were updated'));
    } else {
        headingColor = chalk.black.bgWhite;
        fileColor = chalk.bold.cyan;
        cssFileColor = chalk.cyan;
        console.log(headingColor('These CSS files were found'));
    }
    fileInfo.forEach(fi => {
        let msg;
        if (performUpdate && 'written' in fi && fi.written || !performUpdate) {
            msg = `CSS parent file: ${fi.filename}`;
            console.log(fileColor(msg));
            fi.cssInfo.forEach(ci => {
                msg = `  CSS file: ${ci.cssFile}`;
                console.log(cssFileColor(msg));
            });
        }
    });
}

function searchForDuplicateCssFiles(filename, searchValue, fileContents, cssFileDuplicates) {
    const locations = findAllMatchLocations(searchValue, fileContents);
    if (locations.length > 1) {
        cssFileDuplicates.push({
            'filename': filename,
            'searchValue': searchValue,
            'locations': locations
        })
    }
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

function findAllMatchLocations(needle, haystack) {
    let location = 0;
    const locations = [];

    do {
        location = haystack.indexOf(needle, location);
        if (location > 0) {
            locations.push(location)
        }
    } while (location++ > 0);

    return locations;
}

function showDuplicatesFound(cssFileDuplicates) {
    cssFileDuplicates.forEach(fileDuplicates => {
        fileDuplicates.forEach(fileDuplicate => {
            let msg = `CSS file duplicate: ${fileDuplicate.searchValue} was found in: ${fileDuplicate.filename}`;
            console.log(chalk.red.bgWhite(msg));
            fileDuplicate.locations.forEach(location => {
                msg = `  at absolute file offset: ${location}`
                console.log(chalk.red.bgWhite(msg));
            })
        });
    });
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