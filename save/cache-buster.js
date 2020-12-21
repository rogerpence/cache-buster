const fs = require('fs');
const lineReader = require('line-reader');

function readFile(inputFilename) {
    const array = fs.readFileSync(inputFilename).toString().split("\n");
    return array;
}

function buster(mainCssFilename) {
    //const mainCss = './dist/assets/css/main.css';
    const mainCssContents = fs.readFileSync(mainCssFilename);

    const id = new Date().toISOString();
    const newQueryString = `?v=${id}");`;
    const newMainCssContents = mainCssContents.toString().replace(/\?.*$/, newQueryString);

    fs.writeFile(mainCssFilename, newMainCssContents, (err) => {
        if (err) {
            process.stdout.write(`Error writing to ${mainCssFilename}`);
            process.exit(1);
        }
    });
}

function cmdLine() {
    let argv = require('yargs')
        .usage('usage Cache bust CSS')
        .example('example cache-bust --input (-i) <filename>')
        .option('help', {
            alias: 'h',
            desc: 'help description'
        })
        .option('input', {
            alias: 'i',
            type: 'string',
            desc: 'input file',
            demandOption: 'Please provide --input (-i) argument'
        })
        .option('cssinput', {
            alias: 'c',
            type: 'string',
            desc: 'css input file',
            demandOption: 'Please provide --cssinput (-c) argument'
        })
        .option('apples', {
            alias: 'a',
            type: 'array',
            desc: 'One or more apple types/colors',
            demandOption: 'Please provide --apples (-a) argument'
        })
        .argv

    try {
        const filename = argv.i;
        const cssfile = argv.c
        const apples = argv.apples;
        console.log(filename);
        console.log(cssfile);
        console.log(apples);

        try {
            if (fs.existsSync(filename)) {
                // buster(filename);
                // const fileLines = readFile(filename);
                // fileLines.forEach((line) => {
                //     console.log(line)
                // })
            } else {
                console.log(`cache-bust error: Input file '${filename}' does not exist.`);
                process.exit(1);
            }
        } catch (err) {
            console.error(err)
        }

    } catch (e) {
        process.stdout.write('An exception occurred:\n')
        process.stdout.write('    ' + e.message)
        process.stdout.write('\n')
        process.exit(1)
    }
}

if (require.main === module) {
    cmdLine();
}