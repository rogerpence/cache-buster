const fileio = require('./file-io');
const parser = require('node-html-parser');
const fs = require('fs');
const { nanoid } = require('nanoid');
const path = require('path');

// function refreshLinks(fileContents, cssFiles) {
//     const doc = parser.parse(fileContents);

//     const saveContents = doc.outerHTML;

//     const links = doc.querySelectorAll('link');

//     links.forEach(link => {
//         const href = link.getAttribute('href');
//         cssFiles.forEach(cssFile => {
//             if (href.toLowerCase().includes(cssFile.toLowerCase())) {
//                 console.log(`  Updating reference to ${cssFile}`);
//                 const id = nanoid();
//                 const queryString = `?v=${id}`;
//                 link.setAttribute('href', `${cssFile}${queryString}`);
//             }
//         })
//     });

//     return (saveContents === doc.outerHTML) ? null : doc.outerHTML;
// }

// function injectHashedCssReference(directory, cssFiles, ownerFiles) {
//     ownerFiles.forEach(ownerFilename => {
//         const fullTargetFilename = ownerFilename;
//         let fileContents = fileio.readFile(fullTargetFilename);
//         const originalFileContents = fileContents;

//         fileContents = refreshLinks(fileContents, cssFiles);
//         if (fileContents) {
//             fileio.writeFile(fullTargetFilename, fileContents);
//         }
//     });
// }

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
        console.log(`  from ${cssInfo.href}`);
        console.log(`  to   ${newHref}`);
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
                    console.log(`  ${cssFile.href}`);
                });
            } else {
                console.log(`  no CSS references`);
            }
        }
    });
    if (performUpdate) {
        console.log(`${totalCssReferences} CSS references updated`);
    }
}

if (require.main === module) {
    listOwnersAndCssFiles('dist', ['.html', '.aspx']);
} else {
    module.exports = {
        findCssFiles,
        runAutoBuster,
        listOwnersAndCssFiles,
    }
}