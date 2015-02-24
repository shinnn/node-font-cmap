/*!
 * font-cmap | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/node-font-cmap
*/
'use strict';

var isBuffer = require('is-buffer');
var opentype = require('opentype.js');

module.exports = function fontCmap(fontBuf) {
  if (arguments.length === 0) {
    throw new TypeError('font-cmap requires one argument (buffer).');
  }

  if (!isBuffer(fontBuf)) {
    throw new TypeError(
      fontBuf +
      ' is not a buffer. The first argument to font-cmap must be a buffer.'
    );
  }

  var arrayBuffer = new Uint8Array(fontBuf).buffer;
  return opentype.parse(arrayBuffer).tables.cmap.glyphIndexMap;
};
