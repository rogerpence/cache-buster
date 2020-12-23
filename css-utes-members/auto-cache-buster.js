const fileio = require('./file-io');
const parser = require('node-html-parser');
const fs = require('fs');
const { nanoid } = require('nanoid');
const path = require('path');

function refreshLinks(fileContents, cssFiles) {
    const doc = parser.parse(fileContents);

    const saveContents = doc.outerHTML;

    const links = doc.querySelectorAll('link');

    links.forEach(link => {
        const href = link.getAttribute('href');
        cssFiles.forEach(cssFile => {
            if (href.toLowerCase().includes(cssFile.toLowerCase())) {
                console.log(`  Updating reference to ${cssFile}`);
                const id = nanoid();
                const queryString = `?v=${id}`;
                link.setAttribute('href', `${cssFile}${queryString}`);
            }
        })
    });

    return (saveContents === doc.outerHTML) ? null : doc.outerHTML;
}

function injectHashedCssReference(directory, cssFiles, ownerFiles) {
    ownerFiles.forEach(ownerFilename => {
        const fullTargetFilename = ownerFilename;
        let fileContents = fileio.readFile(fullTargetFilename);
        const originalFileContents = fileContents;

        fileContents = refreshLinks(fileContents, cssFiles);
        if (fileContents) {
            fileio.writeFile(fullTargetFilename, fileContents);
        }
    });
}

function findCssFiles(filename, omitExternalCss = false) {
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

        cssInfo.push({
            href,
            cssFile,
            queryString: href.includes('?') ? queryString : '',
            newQueryString: ''
        })
    })

    return cssInfo;
}

function runAutoBuster(directory, ownerExtensions, omitExternalCss) {
    let totalCssReferences = 0;

    const cssOwnerFiles = fileio.walk(directory, ownerExtensions);
    cssOwnerFiles.forEach(filename => {
        const cssFiles = findCssFiles(filename, omitExternalCss);

        let fileContents = fileio.readFile(filename);
        const originalFileContents = fileContents;

        console.log(`Checking ${filename} for CSS references `);
        fileContents = refreshLinks(fileContents, cssFiles);
        if (fileContents) {
            totalCssReferences++;
            fileio.writeFile(filename, fileContents);
        }
    });
    console.log(`Total files updated: $ {totalCssReferences}`);
}

function listOwnersAndCssFiles(directory, ownerExtensions, omitExternalCss) {
    const cssOwnerFiles = fileio.walk(directory, ownerExtensions);
    let totalCssReferences = 0;
    cssOwnerFiles.forEach(filename => {
        const cssFiles = findCssFiles(filename, omitExternalCss);
        console.log(`${filename.toUpperCase()} has ${cssFiles.length} CSS references.`);
        cssFiles.forEach(cssFile => {
            console.log(`  ${cssFile.href} - ${cssFile.cssFile} - ${cssFile.queryString}`);
            totalCssReferences++;
        });
        console.log('');
    });

    console.log(`Total CSS file references: ${totalCssReferences}`);
}

if (require.main === module) {
    //runNewBuster('dist', ['.html', '.aspx']);
    listOwnersAndCssFiles('dist', ['.html', '.aspx']);
} else {
    module.exports = {
        findCssFiles,
        runAutoBuster,
        listOwnersAndCssFiles,
    }
}