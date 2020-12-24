const fileio = require('./file-io');
const parser = require('node-html-parser');
const fs = require('fs');
const { nanoid } = require('nanoid');
const path = require('path');

const JSSoup = require('jssoup').default;

const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const pretty = require('pretty');


function parseLinks(directory, ownerExtensions) {

    const omitExternalCss = false;
    const cssOwnerFiles = fileio.walk(directory, ownerExtensions);

    const cssInfo = [];

    cssOwnerFiles.forEach(filename => {
        const fileContents = fileio.readFile(filename);
        const dom = new JSDOM(fileContents);

        const ls = dom.window.document.querySelectorAll('link');
        ls.forEach(link => {
            if (link.rel.toLowerCase() == 'stylesheet') {
                const href = link.href;
                if (omitExternalCss && !href.toLowerCase().startsWith('http') || !omitExternalCss) {
                    cssInfo.push({
                        href,
                        cssFile,
                        queryString: href.includes('?') ? queryString : '',
                        newQueryString: `${nanoid()}`
                    })

                    // Trim off query string.
                    const fileRef = href.replace(/\?.*$/, '');
                    link.href = `${fileRef}?${nanoid()}`;
                }
            }
        });

        const fullDoc = pretty(dom.serialize());
        fileio.writeFile(filename, fullDoc);
        console.log(`${filename}`);
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
} else {
    module.exports = {
        findCssFiles,
        runAutoBuster,
        listOwnersAndCssFiles,
    }
}