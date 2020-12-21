const yargs = require('yargs')

function getCmdLineArgs() {
    let args = yargs
        .scriptName('css utilities')
        .usage('$0 <cmd> [args]')
        .command('bust', 'description', (y) => {
            return y
                .option('css-files', {
                    alias: 'c',
                    type: 'array',
                    desc: 'One or more CSS files',
                })
                .option('css-owner-extensions', {
                    alias: 'x',
                    type: 'array',
                    desc: 'CSS owner extensions',
                })
                .example('css-cache-buster --css-files (-c) a [b...] --css-owner-files (-w) a [b...] --directory (-d)')
        }, (argv) => {})
        .command('get-name', 'description for help here', (y) => {
            return y
                .option('first-name', {
                    alias: 'f',
                    type: 'string',
                    desc: 'get first name',
                    required: true,
                })
                .option('last-name', {
                    alias: 'l',
                    type: 'string',
                    desc: 'get last name',
                    required: true
                })
                .example('* = required')
                .example('get-name --first-name* --last-name*')
        }, (argv) => {})
        .command('cache-buster', 'description for help here', (y) => {
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
                .command('tester', 'run tester')
                .option('directory', {
                    alias: 'd',
                    type: 'string',
                    desc: 'directory',
                    required: true,
                })
        }, (argv) => {})
        .argv;

    return args;
}


if (require.main === module) {
    const args = getCmdLineArgs();
    //    console.table(args);
} else {
    module.exports = {
        getCmdLineArgs: getCmdLineArgs
    }
}