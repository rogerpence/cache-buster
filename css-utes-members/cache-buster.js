const parser = require('node-html-parser');
const { nanoid } = require('nanoid');
const fileio = require('./file-io');

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

module.exports = {
    refreshLinks,
    injectHashedCssReference,
}