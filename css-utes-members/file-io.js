const fs = require('fs');
const path = require('path')
const os = require('os');

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
    return fs.readFileSync(inputFilename, 'utf8')
}

function writeFile(outputFilename, contents) {
    fs.writeFileSync(outputFilename, contents, { encoding: 'utf8' });
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

module.exports = {
    walk,
    fileExists,
    readFile,
    writeFile,
    checkForFiles
}