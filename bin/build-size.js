#!/usr/bin/env node
'use strict';
const fs = require('fs');

// noinspection BadExpressionStatementJS
require('yargs')
    .usage('Usage: build-size <command> [options]')
    .demandCommand(1, 'Must provide a valid command')
    .command('parse', 'Parse build size of files matching provided pattern(s)', function parseCommand(yargs) {
        let argv = yargs
            .usage('Usage: build-size parse <pattern> [<pattern>] [options]')
            .example('build-size parse ./css/*.css ./js/*.js', 'Parse multiple patterns e.g. ./css/app.css, ./js/app.js, ./js/vendor.js')
            .example('build-size parse ./js/**/*.js', 'Parse recursive pattern e.g. ./js/app.js, ./js/vendor/vue.js')
            .example('build-size parse ./js/*.[hash].js', 'Parse pattern with hash e.g. ./js/app.33fcb75f3ed81fc89123.js')
            .example('build-size parse ./js/*.js > parse.json', 'Parse and store output in parse.json')
            .positional('pattern', {
                describe: 'Glob pattern to match files. N.B. [hash] can be used as special matching pattern for hashed files',
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
    .command('compare', 'Compare build sizes using output from parse command', function compareCommand(yargs) {
        let argv = yargs
            .usage('Usage: build-size compare <previous> <new> [options]')
            .example('build-size compare ./previous.json ./new.json', 'Compare two sets of build sizes and output results as Markdown')
            .example('build-size compare ./previous.json ./new.json --format=json', 'Compare two sets of build sizes and output results as JSON')
            .positional('previous', {
                describe: 'File with parse results of previous build i.e. output from parse command',
                normalize: true,
                type: 'string'
            })
            .positional('new', {
                describe: 'File with parse results of new build i.e. output from parse command',
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

        let compared = require('../src/compare')(previousSizes, newSizes);
        if (argv.format === 'markdown') {
            compared = require('../src/format')(compared);
        } else {
            compared = JSON.stringify(compared, null, 2);
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
        yargs.showHelp();
    }
}
