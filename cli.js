#!/usr/bin/env node
'use strict';

var fs = require('fs');

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    m: 'min',
    h: 'help',
    v: 'version'
  }
});
var pkg = require('./package.json');

function help() {
  var chalk = require('chalk');

  console.log([
    chalk.cyan(pkg.name) + chalk.gray(' v' + pkg.version),
    pkg.description,
    '',
    'Usage1: ' + pkg.name + ' <font file path>',
    'Usage2: cat <font file path> | ' + pkg.name,
    '',
    'Options:',
    chalk.yellow('--min,     -m  ') + '  Minify output',
    chalk.yellow('--help,    -h  ') + '  Print usage information',
    chalk.yellow('--version, -v  ') + '  Print version',
    ''
  ].join('\n'));
}

function run(buf) {
  var cmapData = require('./')(buf);
  var space;
  if (!argv.min) {
    space = '  ';
  }

  console.log(JSON.stringify(cmapData, null, space));
}

function stderrWriteLn(msg) {
  process.stderr.write(msg + '\n', function() {
    process.exit(1);
  });
}

if (argv.version) {
  console.log(pkg.version);
} else if (argv.help) {
  help();
} else if (process.stdin.isTTY) {
  if (argv._.length === 0) {
    help();
  } else if (!fs.existsSync(argv._[0])) {
    stderrWriteLn('Cannot read the file ' + argv._[0] + '.');
  } else if (!fs.statSync(argv._[0]).isFile()) {
    stderrWriteLn(argv._[0] + ' is not a file.');
  } else {
    run(fs.readFileSync(argv._[0]));
  }
} else {
  require('get-stdin').buffer(run);
}
