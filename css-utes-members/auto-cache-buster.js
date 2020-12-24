const fileio = require('./file-io');
const parser = require('node-html-parser');
const fs = require('fs');
const { nanoid } = require('nanoid');
const path = require('path');

const JSSoup = require('jssoup').default;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const pretty = require('pretty');
const querystring = require('querystring');
const cheerio = require('cheerio');
const { strict } = require('assert');

function useCheerio(directory, ownerExtensions) {
    const omitExternalCss = false;
    //const cssOwnerFiles = fileio.walk(directory, ownerExtensions);

    const cssOwnerFiles = ['C:\\Users\\thumb\\Documents\\programming\\node\\cache-buster\\dist\\index.html'];
    const cssInfo = [];

    let $;

    cssOwnerFiles.forEach(filename => {
        const fileContents = fileio.readFile(filename);
        $ = cheerio.load(fileContents, { decodeEntities: false });

        const links = [];

        $('link').each((i, link) => {
            const href = $(link).attr('href');
            const cssFile = href.replace(/\?.*/, '');
            const queryString = href.replace(/^.*\?/, '');

            const qs = querystring.parse(queryString);
            qs.v = nanoid();
            const newQs = querystring.stringify(qs);

            $(link).attr('href', `${cssFile}?${newQs}`);
            console.log('from');
            console.log(`${cssFile}?${newQs}`);
            console.log('to');
            console.log($.html(link));
        })
    });

    // console.log($.root().html());
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

function parseLinks(directory, ownerExtensions) {

    const omitExternalCss = false;
    //const cssOwnerFiles = fileio.walk(directory, ownerExtensions);

    const cssOwnerFiles = ['C:\\Users\\thumb\\Documents\\programming\\node\\cache-buster\\dist\\index.html'];

    const cssInfo = [];

    cssOwnerFiles.forEach(filename => {
        let fileContents = fileio.readFile(filename);
        const dom = new JSDOM(fileContents);

        const cssInfo = [];

        const ls = dom.window.document.querySelectorAll('link');
        ls.forEach(link => {
            if (link.rel.toLowerCase() == 'stylesheet') {
                const cssInfoObject = {}
                cssInfoObject.href = link.href;
                cssInfoObject.oldHref = link.href;
                cssInfoObject.cssFile = cssInfoObject.href.replace(/\?.*/, '');
                cssInfoObject.queryString = (cssInfoObject.href.includes('?')) ? cssInfoObject.href.replace(/^.*\?/, '') : '';

                if (cssInfoObject.cssFile.match(/\.css$/i)) {
                    if (omitExternalCss && !cssInfoObjecthref.toLowerCase().startsWith('http') || !omitExternalCss) {
                        const qs = querystring.parse(cssInfoObject.queryString);
                        qs.v = nanoid();
                        cssInfoObject.newQueryString = querystring.stringify(qs);
                    }
                    link.href = cssInfoObject.cssFile + '?' + cssInfoObject.newQueryString;
                    if ((findAllMatchLocations(cssInfoObject.oldHref, fileContents)).length == 1) {
                        fileContents = fileContents.replace(cssInfoObject.oldHref, link.href);
                        console.log(`${link.href} replaced ${cssInfoObject.oldHref}`);
                    }
                }
            }
        });

        fileio.writeFile(filename, fileContents);
    });
}


function findCssFiles(filename, performUpdate, omitExternalCss = false) {
    const fileContents = fileio.readFile(filename);

    // const regexp = /href=.*css/gmi;
    // const regexp = /\<link.*css/gmi;

    const regexp = /\<link.*\>/gmi;
    const cssInfo = [];

    const ms = [...fileContents.matchAll(regexp)];
    ms.forEach(m => {
        const linkLine = parser.parse(m[0]);
        const linkElement = linkLine.querySelector('link');

        const href = linkElement.getAttribute('href');
        const cssFile = href.replace(/\?.*/, '');
        const queryString = href.replace(/^.*\?/, '');

        if (omitExternalCss && !href.toLowerCase().startsWith('http') || !omitExternalCss) {
            cssInfo.push({
                href,
                cssFile,
                queryString: href.includes('?') ? queryString : '',
                newQueryString: `v=${nanoid()}`
            })
        }
    });

    if (performUpdate) {
        updateCssReferences(filename, fileContents, cssInfo);
    }

    return cssInfo;
}

function updateCssReferences(filename, fileContents, cssInfo) {
    if (cssInfo.length == 0) {
        return;
    }
    console.log(`${filename} ${cssInfo.length} changes made:`)

    cssInfo.forEach(cssInfo => {
        const newHref = cssInfo.cssFile + '?' + cssInfo.newQueryString;
        console.log(`from ${cssInfo.href}`);
        console.log(`to ${newHref}`);
        fileContents = fileContents.replace(cssInfo.href, newHref);
    });

    // Write file here. 
    fileio.writeFile(filename, fileContents);
}

function runAutoBuster(directory, ownerExtensions, omitExternalCss) {
    console.log('Updating CSS references');
    processCss(directory, ownerExtensions, omitExternalCss, performUpdate = true)
}

function listOwnersAndCssFiles(directory, ownerExtensions, omitExternalCss) {
    console.log('Listing CSS references');
    processCss(directory, ownerExtensions, omitExternalCss, performUpdate = false)
}

function processCss(directory, ownerExtensions, omitExternalCss, performUpdate) {
    const cssOwnerFiles = fileio.walk(directory, ownerExtensions);
    let totalCssReferences = 0;
    cssOwnerFiles.forEach(filename => {
        const cssFiles = findCssFiles(filename, performUpdate, omitExternalCss);
        totalCssReferences += cssFiles.length;
        if (!performUpdate) {
            console.log(`${filename}:`);
            if (cssFiles.length > 0) {
                cssFiles.forEach(cssFile => {
                    console.log(`${cssFile.href }`);
                });
            } else {
                console.log(`no CSS references `);
            }
        }
    });
    if (performUpdate) {
        console.log(`${totalCssReferences} CSS references updated `);
    }
}

if (require.main === module) {
    //    listOwnersAndCssFiles('dist', ['.html', '.aspx', 'cshtml']);
    parseLinks('dist', ['.html', '.aspx', '.cshtml']);
    //useCheerio('dist', ['.html', '.aspx', '.cshtml']);
} else {
    module.exports = {
        findCssFiles,
        runAutoBuster,
        listOwnersAndCssFiles,
    }
}