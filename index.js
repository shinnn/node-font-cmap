/*!
 * font-cmap | MIT (c) Shinnosuke Watanabe
 * https://github.com/shinnn/node-font-cmap
*/
'use strict';

var opentype = require('opentype.js');

module.exports = function fontCmap(fontBuf) {
  if (arguments.length === 0) {
    throw new TypeError('One argument (buffer) required.');
  }

  if (!Buffer.isBuffer(fontBuf)) {
    throw new TypeError(fontBuf + ' is not a buffer.');
  }

  var arrayBuffer = new Uint8Array(fontBuf).buffer;
  return opentype.parse(arrayBuffer).tables.cmap.glyphIndexMap;
};
