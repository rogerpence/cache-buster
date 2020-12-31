const yargs = require('yargs')

function getCmdLineArgs() {
    let args = yargs
        .scriptName('css utilities')
        .usage('$0 <cmd> [args]')
        .command(['cache-bust', '$0'], 'description for help here', (y) => {
            return addCssCacheBusterArgs(y);
        }, (argv) => {})
        .argv;

    return args;
}

function addCssCacheBusterArgs(y) {
    return y
        .option('help', {
            alias: 'h'
        })
        .option('root-directory', {
            alias: 'd',
            type: 'string',
            desc: 'directory',
            required: true,
        })
        .option('update', {
            alias: 'u',
            type: 'boolean',
            desc: 'perform update',
            default: false
        })
        .option('css-owner-extensions', {
            alias: 'x',
            type: 'array',
            desc: 'CSS owner extensions',
            default: ['.html', '.cshtml', '.aspx', '.vue']
                // -x .html .cshtml
        })
        .option('include-external-css', {
            alias: 'i',
            type: 'boolean',
            desc: 'include external CSS',
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