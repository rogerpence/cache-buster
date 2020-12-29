const fileio = require('./file-io');
const fs = require('fs');
const { nanoid } = require('nanoid');
const path = require('path');
const chalk = require('chalk');

// const JSSoup = require('jssoup').default;
// const parser = require('node-html-parser');
// const pretty = require('pretty');
// const cheerio = require('cheerio');

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const querystring = require('querystring');

function runCssCacheBuster(directory, performUpdate = false, ownerExtensions, includeExternalCss = false) {
    const fileInfo = getCssInfo(directory, performUpdate, ownerExtensions, includeExternalCss);

    fileInfo.forEach(fi => {
        let fileContents = fileio.readFile(fi.filename);
        const oldFileContents = fileContents;
        const cssFileDuplicates = [];
        const cssFilenamesChecked = [];

        fi.cssInfo.forEach(ci => {
            const newHref = `${ci.cssFile}?${ci.newQueryString}`;
            fileContents = fileContents.replace(ci.oldHref, newHref);

            if (!cssFilenamesChecked.find(val => val == ci.cssFile.toLowerCase())) {
                cssFilenamesChecked.push(ci.cssFile.toLowerCase());
                const dupeLocations = (searchForDuplicateCssFiles(ci.cssFile, fileContents))
                if (dupeLocations) {
                    cssFileDuplicates.push({
                        'filename': fi.filename,
                        'cssFilename': ci.cssFile,
                        'locations': dupeLocations
                    })
                }
            }
        });

        if (performUpdate && oldFileContents !== fileContents) {
            fileio.writeFile(fi.filename, fileContents);
        }
    })
}

function searchForDuplicateCssFiles(cssFilename, fileContents) {
    const locations = findAllMatchLocations(cssFilename, fileContents);
    return (locations.length > 1) ? locations : null;
}

function getCssInfo(directory, performUpdate = false, ownerExtensions, includeExternalCss = false) {
    const cssOwnerFiles = fileio.walk(directory, ownerExtensions);

    //const cssOwnerFiles = ['C:\\Users\\thumb\\Documents\\programming\\node\\cache-buster\\dist\\index.html'];

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
                cssInfoObject.oldHref = link.href;
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


// -------------------------

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

function showDuplicatesFound(cssFileDupicatesDetail) {
    cssFileDupicatesDetail.forEach(fileDuplicate => {
        let msg = `file duplicate found: ${fileDuplicate.filename}`;
        console.log(chalk.red.bgWhite(msg));
        fileDuplicate.locations.forEach(location => {
            msg = `  at absolute location: ${location}`
            console.log(chalk.red.bgWhite(msg));
        })
    })
}

function runAutoBuster(directory, performUpdate, ownerExtensions, includeExternalCss) {
    parseLinks(directory, performUpdate, ownerExtensions, includeExternalCss)
}

if (require.main === module) {
    //parseLinks('dist', ownerExtensions = ['.html', '.aspx', '.cshtml'], performUpdate = false, includeExternalCss = true);
    runCssCacheBuster('dist', performUpdate = true, ownerExtensions = ['.html', '.aspx', '.cshtml'], includeExternalCss = true);
} else {
    module.exports = {
        runAutoBuster,
    }
}