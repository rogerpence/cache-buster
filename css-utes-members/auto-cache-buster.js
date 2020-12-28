const fileio = require('./file-io');
const parser = require('node-html-parser');
const fs = require('fs');
const { nanoid } = require('nanoid');
const path = require('path');
const chalk = require('chalk');

const JSSoup = require('jssoup').default;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const pretty = require('pretty');
const querystring = require('querystring');
const cheerio = require('cheerio');
const { strict } = require('assert');

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

function parseLinks(directory, ownerExtensions, performUpdate = false) {
    if (performUpdate) {
        console.log(chalk.green.bgWhite('Files will be updated'));
    } else {
        console.log(chalk.blue.bgYellow('Listing files only... no update will be performed'));
    }

    const omitExternalCss = false;
    const cssOwnerFiles = fileio.walk(directory, ownerExtensions);

    //const cssOwnerFiles = ['C:\\Users\\thumb\\Documents\\programming\\node\\cache-buster\\dist\\index.html'];

    const cssInfo = [];
    let cssFileDuplicatesNameOnly;
    let cssFileDupicatesDetail;

    cssOwnerFiles.forEach(filename => {
        let fileContents = fileio.readFile(filename);
        const dom = new JSDOM(fileContents);

        const cssInfo = [];
        cssFileDuplicatesNameOnly = [];
        cssFileDupicatesDetail = [];


        console.log(filename);
        const ls = dom.window.document.querySelectorAll('link');
        ls.forEach(link => {
            if (link.rel.toLowerCase() == 'stylesheet') {
                const cssInfoObject = {}
                cssInfoObject.href = link.href;
                cssInfoObject.oldHref = link.href;
                cssInfoObject.cssFile = cssInfoObject.href.replace(/\?.*/, '');
                cssInfoObject.queryString = (cssInfoObject.href.includes('?')) ? cssInfoObject.href.replace(/^.*\?/, '') : '';
                cssInfo.push(cssInfoObject);

                if (cssInfoObject.cssFile.toLowerCase().endsWith('.css')) {
                    if (omitExternalCss && !cssInfoObjecthref.toLowerCase().startsWith('http') || !omitExternalCss) {
                        const qs = querystring.parse(cssInfoObject.queryString);
                        qs.v = nanoid();
                        cssInfoObject.newQueryString = querystring.stringify(qs);
                    }
                    link.href = cssInfoObject.cssFile + '?' + cssInfoObject.newQueryString;
                    const locations = findAllMatchLocations(cssInfoObject.cssFile, fileContents);

                    fileContents = fileContents.replace(cssInfoObject.oldHref, link.href);
                    let msg;
                    if (performUpdate) {
                        msg = `  ${cssInfoObject.cssFile} query string replaced`
                        console.log(chalk.green(msg));
                    } else {
                        msg = `  ${cssInfoObject.cssFile} query string would be replaced`
                        console.log(chalk.white(msg));
                    }

                    if (locations.length > 1) {
                        if (!cssFileDuplicatesNameOnly.find(val => val == cssInfoObject.cssFile.toLowerCase())) {
                            cssFileDuplicatesNameOnly.push(cssInfoObject.cssFile.toLowerCase());
                            registerDuplicate(cssInfoObject, locations, cssFileDupicatesDetail);
                        }
                    }
                };
            };
        });

        showDuplicatesFound(cssFileDupicatesDetail);

        if (performUpdate) {
            fileio.writeFile(filename, fileContents);
        }
    });
}

function registerDuplicate(cssInfoObject, locations, cssFileDupicatesDetail) {
    cssFileDupicatesDetail.push({
        filename: cssInfoObject.cssFile.toLowerCase(),
        locations: locations
    });
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

function runAutoBuster(directory, ownerExtensions, performUpdate) {
    parseLinks(directory, ownerExtensions, performUpdate)
}

// function runAutoBusterPreview(directory, ownerExtensions, performUpdate) {
//     parseLinks(directory, ownerExtensions, performUpdate = false)
// }


if (require.main === module) {
    parseLinks('dist', ['.html', '.aspx', '.cshtml'], performUpdate = false);
} else {
    module.exports = {
        runAutoBuster,
    }
}