const cmdargs = require('./get-args');
const fileio = require('./file-io');
const cb = require('./cache-buster');

const args = cmdargs.getCmdLineArgs()

if (require.main === module) {
    const argv = cmdargs.getCmdLineArgs();
    if (!argv.cssOwnerFiles) {
        argv.cssOwnerFiles = fileio.walk(argv.directory, argv.cssOwnerExtensions);
    } else {
        fileio.checkForFiles(argv.cssOwnerFiles);
    }

    cb.injectHashedCssReference(argv.directory, argv.cssFiles, argv.cssOwnerFiles, argv.cssOwnerExtensions);
}