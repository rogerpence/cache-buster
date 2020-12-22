const cmdargs = require('./get-args');
const fileio = require('./file-io');
const cb = require('./cache-buster');
const acb = require('./auto-cache-buster');

/*
    node css-utes cache-buster -c assets/css/global.min.css assets/css/main.css -d dist
*/
const args = cmdargs.getCmdLineArgs()

if (require.main === module) {
    const argv = cmdargs.getCmdLineArgs();
    const commandName = argv._[0];

    if (commandName === 'cache-buster') {
        if (!argv.cssOwnerFiles) {
            argv.cssOwnerFiles = fileio.walk(argv.directory, argv.cssOwnerExtensions);
        } else {
            fileio.checkForFiles(argv.cssOwnerFiles);
        }

        cb.injectHashedCssReference(
            argv.directory,
            argv.cssFiles,
            argv.cssOwnerFiles,
            argv.cssOwnerExtensions);
    } else if (commandName === 'auto-cache-buster') {
        acb.runAutoBuster(argv.directory, argv.cssOwnerExtensions);
    } else if (commandName === 'list-css-references') {
        acb.listOwnersAndCssFiles(argv.directory, argv.cssOwnerExtensions);
    }

}