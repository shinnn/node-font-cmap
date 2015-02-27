# font-cmap

[![NPM version](https://img.shields.io/npm/v/font-cmap.svg)](https://www.npmjs.com/package/font-cmap)
[![Build Status](https://travis-ci.org/shinnn/node-font-cmap.svg?branch=master)](https://travis-ci.org/shinnn/node-font-cmap)
[![Build status](https://ci.appveyor.com/api/projects/status/71pgh750h4tnf30i?svg=true)](https://ci.appveyor.com/project/ShinnosukeWatanabe/node-font-cmap)
[![Coverage Status](https://img.shields.io/coveralls/shinnn/node-font-cmap.svg)](https://coveralls.io/r/shinnn/node-font-cmap)
[![Dependency Status](https://img.shields.io/david/shinnn/node-font-cmap.svg?label=deps)](https://david-dm.org/shinnn/node-font-cmap)
[![devDependency Status](https://img.shields.io/david/dev/shinnn/node-font-cmap.svg?label=devDeps)](https://david-dm.org/shinnn/node-font-cmap#info=devDependencies)

Parse [CMap](http://www.microsoft.com/typography/otspec/cmap.htm) of a TrueType/OpenType font file [buffer][buffer]

```javascript
var fs = require('fs');
var fontCmap = require('font-cmap');

var buf = fs.readFileSync('bower_components/font-awesome/fonts/FontAwesome.otf');

fontCmap(buf); //=> {"32": 1, "168": 6, "169": 12, "174": 10, ... }
```

## Installation

[Use npm](https://docs.npmjs.com/cli/install).

```sh
npm install font-cmap
```

## API

```javascript
var fontCmap = require('font-cmap');
```

### fontCmap(*buffer*)

*buffer*: `Object` ([`Buffer`][buffer] of a TrueType/OpenType font file)  
Return: `Object`

It returns an object of a CMap table in the form:

```javascript
{
  "Unicode value (integer)": "Glyph ID (integer)"
}
```

[Here](https://raw.githubusercontent.com/shinnn/node-font-cmap/master/test/fixture.json) is a real-life example, the result of parsing [Font Awesome](https://fortawesome.github.io/Font-Awesome/) CMap table.

## CLI

You can use this module as a CLI tool by installing it [globally](https://docs.npmjs.com/files/folders#global-installation).

```sh
npm install -g font-cmap
```

### Usage

```
Usage1: font-cmap <font file path>
Usage2: cat <font file path> | font-cmap

Options:
--min,     -m    Minify output
--help,    -h    Print usage information
--version, -v    Print version
```

It prints a CMap table as a [JSON](http://www.json.org/) string.

## License

Copyright (c) 2014 - 2015 [Shinnosuke Watanabe](https://github.com/shinnn)

Licensed under [the MIT License](./LICENSE).

[buffer]: https://nodejs.org/api/buffer.html#buffer_buffer
