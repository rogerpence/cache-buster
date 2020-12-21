const fs = require('fs');
const path = require('path')
const parser = require('node-html-parser');
const os = require('os');
const { nanoid } = require('nanoid');

function walk(directory, extensions = ['.aspx', '.html', '.vue'], filepaths = []) {
    const files = fs.readdirSync(directory);
    for (let filename of files) {
        const filepath = path.join(directory, filename);
        if (fs.statSync(filepath).isDirectory()) {
            walk(filepath, extensions, filepaths);
        } else {
            const ext = path.extname(filename).toLowerCase();
            if (extensions.includes(ext)) {
                filepaths.push(filepath);
            }
        }
    }
    return filepaths;
}

function fileExists(filename) {
    return fs.existsSync(filename)
}

function readFile(inputFilename) {
    return fs.readFileSync(inputFilename)
}

function writeFile(outputFilename, contents) {
    console.log(`CSS reference updated in file ${outputFilename}`);
    fs.writeFileSync(outputFilename, contents);
}

function checkForFiles(fileList, directory = '') {
    let allFilesFound = true;
    let fullFilename;

    fileList.forEach(filename => {
        fullFilename = path.join(directory, filename);
        if (!fileExists(fullFilename)) {
            console.log(`file not found: ${fullFilename}`)
            allFilesFound = false;
        }
    })

    if (!allFilesFound) {
        console.log('Error: files not found');
        process.exit(1);
    }
}

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

    if (saveContents === doc.outerHTML) {
        return null;
    } else {
        return doc.outerHTML;
    }
}

function injectHashedCssReference(directory, cssFiles, ownerFiles) {
    ownerFiles.forEach(ownerFilename => {
        //const fullTargetFilename = path.join(directory, ownerFilename);
        const fullTargetFilename = ownerFilename;
        let fileContents = readFile(fullTargetFilename);
        const originalFileContents = fileContents;

        fileContents = refreshLinks(fileContents, cssFiles);
        if (fileContents) {
            writeFile(fullTargetFilename, fileContents);
        }
    });
}

function getCmdLineArgs() {
    let argv = require('yargs')
        .usage('CSS cache buster')
        .example('css-cache-buster --css-files (-c) a [b...] --css-owner-files (-w) a [b...] --directory (-d)')
        .command('bust', 'cache buster')
        .option('help', {
            alias: 'h',
            desc: 'Show help'
        })
        .option('css-files', {
            alias: 'c',
            type: 'array',
            desc: 'One or more CSS files',
            demandOption: 'Please provide --css-files (-c) argument'
        })
        .option('css-owner-extensions', {
            alias: 'x',
            type: 'array',
            desc: 'CSS owner extensions',
            default: ['.html', 'cshtml', '.aspx', '.vue']
        })
        .option('css-owner-files', {
            alias: 'w',
            type: 'array',
            desc: 'One or more css owner files',
            //demandOption: 'Please provide --css-owner-files (-w) argument'
        })
        .option('directory', {
            alias: 'd',
            type: 'string',
            desc: 'directory',
            demandOption: 'Please provide --directory (d) root directory'
        })
        .command('tester', 'run tester')
        .option('directory', {
            alias: 'd',
            type: 'string',
            desc: 'directory',
            demandOption: 'Please provide --directory (d) root directory',
            command: 'tester'
        })


    .argv
    return argv
}

if (require.main === module) {
    const argv = getCmdLineArgs();
    if (!argv.cssOwnerFiles) {
        argv.cssOwnerFiles = walk(argv.directory, argv.cssOwnerExtensions);
    } else {
        checkForFiles(argv.cssOwnerFiles);
    }

    injectHashedCssReference(argv.directory, argv.cssFiles, argv.cssOwnerFiles, argv.cssOwnerExtensions);
}