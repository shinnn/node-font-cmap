#!/usr/bin/env node
'use strict';

var argv = require('minimist')(process.argv.slice(2), {
  alias: {
    m: 'min',
    h: 'help',
    v: 'version'
  },
  string: ['_'],
  boolean: ['min', 'help', 'version']
});

function help() {
  var yellow = require('chalk').yellow;
  var sumUp = require('sum-up');

  var pkg = require('./package.json');

  console.log([
    sumUp(pkg),
    '',
    'Usage1: ' + pkg.name + ' <font file path>',
    'Usage2: cat <font file path> | ' + pkg.name,
    '',
    'Options:',
    yellow('--min,     -m') + '  Minify output',
    yellow('--help,    -h') + '  Print usage information',
    yellow('--version, -v') + '  Print version',
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
  console.log(require('./package.json').version);
} else if (argv.help) {
  help();
} else if (process.stdin.isTTY) {
  var fs = require('fs');

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
