'use strict';

var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;

var isPlainObject = require('lodash').isPlainObject;
var test = require('tape');
var fontCmap = require('../');

var pkg = require('../package.json');

var fontDir = 'node_modules/font-awesome/fonts';
var otfFontPath = path.join(fontDir, 'FontAwesome.otf');
var otfFont = fs.readFileSync(otfFontPath);
var ttfFontPath = path.join(fontDir, 'fontawesome-webfont.ttf');
var ttfFont = fs.readFileSync(ttfFontPath);
var eotFontPath = path.join(fontDir, 'fontawesome-webfont.eot');
var eotFont = fs.readFileSync(eotFontPath);

var jsonText = fs.readFileSync('test/fixture.json').toString();
var cmapData = JSON.parse(jsonText);

test('fontCmap()', function(t) {
  t.plan(6);

  t.deepEqual(
    fontCmap(otfFont), cmapData,
    'should create glyph map object of OTF.'
  );

  t.ok(isPlainObject(fontCmap(ttfFont)), 'should create glyph map object of TTF.');

  t.throws(
    fontCmap.bind(null), /TypeError/,
    'should throw an error when it takes no arguments.'
  );

  t.throws(
    fontCmap.bind(null, ['foo']), /TypeError/,
    'should throw an error when it takes a non-buffer argument.'
  );

  t.throws(
    fontCmap.bind(null, eotFont), /Unsupported/,
    'should throw an error when it takes a buffer of unsupported font file.'
  );

  t.throws(
    fontCmap.bind(null, fs.readFileSync(__filename)), /Unsupported/,
    'should throw an error when it takes a buffer of non-font file.'
  );
});

test('"font-cmap" command inside a TTY context', function(t) {
  t.plan(12);

  var cmd = function(args) {
    var cp = spawn('node', [pkg.bin].concat(args), {
      stdio: [process.stdin, null, null]
    });
    cp.stdout.setEncoding('utf8');
    cp.stderr.setEncoding('utf8');
    return cp;
  };

  cmd([otfFontPath]).stdout.on('data', function(output) {
    t.doesNotThrow(
      JSON.parse.bind(null, output),
      'should print a valid JSON.'
    );
  });

  cmd([ttfFontPath, '--min']).stdout.on('data', function(output) {
    t.notOk(
      / /.test(output),
      'should remove whitespaces from output using --min flag'
    );
  });

  cmd([ttfFontPath, '-m']).stdout.on('data', function(output) {
    t.notOk(/\ /.test(output), 'should accept --min alias');
  });

  cmd(['--version']).stdout.on('data', function(output) {
    t.equal(
      output, pkg.version + '\n',
      'should print version using --version flag.'
    );
  });

  cmd(['-v']).stdout.on('data', function(output) {
    t.equal(output, pkg.version + '\n', 'should accept -v alias.');
  });

  cmd(['--help']).stdout.on('data', function(output) {
    t.ok(/Usage/.test(output), 'should print usage information using --help flag.');
  });

  cmd(['-h']).stdout.on('data', function(output) {
    t.ok(/Usage/.test(output), 'should accept -h alias.');
  });

  cmd([]).stdout.on('data', function(output) {
    t.ok(
      /Usage/.test(output),
      'should print usage information when it takes no CLI arguments.'
    );
  });

  var err = '';
  cmd([eotFontPath])
    .on('close', function(code) {
      t.notEqual(code, 0, 'should fail when the file is unsupported.');
      t.ok(
        /Unsupported/.test(err),
        'should print an error when the file is unsupported.'
      );
    })
    .stderr.on('data', function(output) {
      err += output;
    });

  cmd(['foo']).stderr.on('data', function(output) {
    t.ok(
      /Cannot/.test(output),
      'should print an error when the file doesn\'t exist.'
    );
  });

  cmd(['node_modules']).stderr.on('data', function(output) {
    t.ok(
      /is not a file/.test(output),
      'should print an error when the path is not a file.'
    );
  });
});

test('"font-cmap" command outside a TTY context', function(t) {
  t.plan(3);

  var cmd = function(args) {
    var cp = spawn('node', [pkg.bin].concat(args), {
      stdio: ['pipe', null, null]
    });
    cp.stdout.setEncoding('utf8');
    cp.stderr.setEncoding('utf8');
    return cp;
  };

  var cp = cmd([]);
  cp.stdout.on('data', function(output) {
    t.equal(output, jsonText, 'should parse stdin and print a valid JSON.');
  });
  cp.stdin.end(otfFont);

  var err = '';
  var cpErr = cmd([]);
  cpErr.on('close', function(code) {
    t.notEqual(code, 0, 'should fail when stdin receives unsupported file buffer.');
    t.ok(
      /Unsupported/.test(err),
      'should print usage information when stdin receives unsupported file buffer.'
    );
  });
  cpErr.stderr.on('data', function(output) {
    err += output;
  });
  cpErr.stdin.end(eotFont);
});
