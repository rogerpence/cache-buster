const yargs = require('yargs')

function getCmdLineArgs() {
    let args = yargs
        .scriptName('css utilities')
        .usage('$0 <cmd> [args]')
        .command('cache-buster', 'description for help here', (y) => {
            return addCacheBusterArgs(y);
        }, (argv) => {})
        .command('css-cache-buster', 'description for help here', (y) => {
            return addCssCacheBusterArgs(y);
        }, (argv) => {})
        .command('list-css-references', 'description for help here', (y) => {
            return addCssCacheBusterArgs(y);
        }, (argv) => {})
        .argv;

    return args;
}

function addCacheBusterArgs(y) {
    return y
        .option('css-files', {
            alias: 'c',
            type: 'array',
            desc: 'One or more CSS files',
            required: true
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
        })
        .option('directory', {
            alias: 'd',
            type: 'string',
            desc: 'directory',
            required: true
        })
}

function addCssCacheBusterArgs(y) {
    return y
        .option('root-directory', {
            alias: 'd',
            type: 'string',
            desc: 'directory',
            required: true,
        })
        .option('css-owner-extensions', {
            alias: 'x',
            type: 'array',
            desc: 'CSS owner extensions',
            default: ['.html', '.cshtml', '.aspx', '.vue']
        })
        .option('update', {
            alias: 'u',
            type: 'boolean',
            desc: 'perform update',
            default: false
        })

}

if (require.main === module) {
    const args = getCmdLineArgs();
} else {
    module.exports = {
        getCmdLineArgs: getCmdLineArgs
    }
}