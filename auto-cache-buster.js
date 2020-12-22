const fileio = require('./file-io');
const parser = require('node-html-parser');
const fs = require('fs');
const { nanoid } = require('nanoid');


function refreshLinks(fileContents, cssFiles) {
    const doc = parser.parse(fileContents);

    const saveContents = doc.outerHTML;

    const links = doc.querySelectorAll('link');

    links.forEach(link => {
        const href = link.getAttribute('href');
        cssFiles.forEach(cssFile => {
            if (href.toLowerCase().includes(cssFile.toLowerCase())) {
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

function findCssFiles(filename) {
    const fileContents = fileio.readFile(filename);

    const regexp = /href=.*css/gmi;
    const matches = [];

    const ms = [...fileContents.matchAll(regexp)];
    ms.forEach(m => {
        const cssFile = m[0].replace(/^href=['"]/i, '');
        matches.push(cssFile);
    });

    return matches;
}

function runAutoBuster(directory, ownerExtensions) {
    const cssOwnerFiles = fileio.walk(directory, ownerExtensions);
    cssOwnerFiles.forEach(filename => {
        const cssFiles = findCssFiles(filename);

        let fileContents = fileio.readFile(filename);
        const originalFileContents = fileContents;

        fileContents = refreshLinks(fileContents, cssFiles);
        if (fileContents) {
            fileio.writeFile(filename, fileContents);
        }
    });
}

function listOwnersAndCssFiles(directory, ownerExtensions) {
    const cssOwnerFiles = fileio.walk(directory, ownerExtensions);
    cssOwnerFiles.forEach(filename => {
        const cssFiles = findCssFiles(filename);
        console.log(`${filename.toUpperCase()} has ${cssFiles.length} CSS references.`);
        cssFiles.forEach(cssFile => {
            console.log(`    ${cssFile}`);
        });
        console.log('');
    });
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