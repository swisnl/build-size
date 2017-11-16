#! /usr/bin/env node
const fs = require('fs');

// noinspection BadExpressionStatementJS
require('yargs')
    .usage('Usage: $0 <command> [options]')
    .demandCommand(1, 'Must provide a valid command')
    .command('parse', 'Parse build size of files matching provided pattern(s)', function parseCommand(yargs) {
        let argv = yargs
            .usage('Usage: $0 parse <pattern> [<pattern>] [options]')
            .positional('pattern', {
                describe: 'Glob pattern to match files',
                normalize: true,
                type: 'string'
            })
            .argv;
        checkCommands(yargs, argv, 2);
    }, function parse(argv) {
        let patterns = argv._;
        patterns.shift();
        // TODO: Verify glob patterns

        let parsed = require('../src/parse')(patterns);
        process.stdout.write(JSON.stringify(parsed, null, 2));
    })
    .command('compare', 'Compare build sizes', function compareCommand(yargs) {
        let argv = yargs
            .usage('Usage: $0 compare <previous> <new> [options]')
            .positional('previous', {
                describe: 'File with parse results of previous build',
                normalize: true,
                type: 'string'
            })
            .positional('new', {
                describe: 'File with parse results of new build',
                normalize: true,
                type: 'string'
            })
            .option('format', {
                choices: ['json', 'markdown'],
                default: 'markdown'
            })
            .argv;
        checkCommands(yargs, argv, 3);
    }, function compare(argv) {
        let args = argv._;
        args.shift();

        let previousSizes = JSON.parse(fs.readFileSync(args.shift(), 'utf8'));
        let newSizes = JSON.parse(fs.readFileSync(args.shift(), 'utf8'));

        let compared = require('../src/compare')(previousSizes, newSizes, argv.format === 'markdown');
        if (argv.format !== 'markdown') {
            compared = JSON.stringify(compared);
        }
        process.stdout.write(compared);
    })
    .alias('help', 'h')
    .alias('version', 'v')
    .strict()
    .wrap(null)
    .argv;

function checkCommands(yargs, argv, numRequired) {
    if (argv._.length < numRequired) {
        yargs.showHelp()
    }
}
