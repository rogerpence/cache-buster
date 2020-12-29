const cmdargs = require('./css-utes-members/get-args');
const fileio = require('./css-utes-members/file-io');
const cb = require('./css-utes-members/cache-buster');
const acb = require('./css-utes-members/auto-cache-buster');

/*
    node css-utes cache-buster -c assets/css/global.min.css assets/css/main.css -d dist
*/
const args = cmdargs.getCmdLineArgs()

if (require.main === module) {
    const argv = cmdargs.getCmdLineArgs();
    const commandName = argv._[0];

    if (commandName === 'cache-buster') {
        if (!argv.cssOwnerFiles) {
            argv.cssOwnerFiles = fileio.walk(argv.directory, argv.cssOwnerExtensions, argv.includeExternalCss);
        } else {
            fileio.checkForFiles(argv.cssOwnerFiles);
        }

        cb.injectHashedCssReference(
            argv.directory,
            argv.cssFiles,
            argv.cssOwnerFiles,
            argv.cssOwnerExtensions);

    } else if (commandName === 'css-cache-buster') {
        acb.runAutoBuster(argv.rootDirectory, argv.update, argv.cssOwnerExtensions, argv.includeExternalCss);

    } else if (commandName === 'css') {
        acb.runAutoBusterPreview(argv.rootDirectory, argv.cssOwnerExtensions, argv.omitExternalCss);

    } else {
        console.log(`Command not found: ${commandName}`);
    }
}

/*
To update CSS links
    node css-utes css-cache-buster -d dist -u

To list CSS link
    node css-utes css-cache-buster -d dist -u
*/