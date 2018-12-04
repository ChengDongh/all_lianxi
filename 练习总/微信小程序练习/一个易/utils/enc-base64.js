var CryptoJS = CryptoJS || function (h, o) {
  var f = {}, j = f.lib = {}, k = j.Base = function () { function a() { } return { extend: function (b) { a.prototype = this; var c = new a; b && c.mixIn(b); c.$super = this; return c }, create: function () { var a = this.extend(); a.init.apply(a, arguments); return a }, init: function () { }, mixIn: function (a) { for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]); a.hasOwnProperty("toString") && (this.toString = a.toString) }, clone: function () { return this.$super.extend(this) } } }(), i = j.WordArray = k.extend({
    init: function (a, b) {
      a =
      this.words = a || []; this.sigBytes = b != o ? b : 4 * a.length
    }, toString: function (a) { return (a || p).stringify(this) }, concat: function (a) { var b = this.words, c = a.words, d = this.sigBytes, a = a.sigBytes; this.clamp(); if (d % 4) for (var e = 0; e < a; e++)b[d + e >>> 2] |= (c[e >>> 2] >>> 24 - 8 * (e % 4) & 255) << 24 - 8 * ((d + e) % 4); else if (65535 < c.length) for (e = 0; e < a; e += 4)b[d + e >>> 2] = c[e >>> 2]; else b.push.apply(b, c); this.sigBytes += a; return this }, clamp: function () { var a = this.words, b = this.sigBytes; a[b >>> 2] &= 4294967295 << 32 - 8 * (b % 4); a.length = h.ceil(b / 4) }, clone: function () {
      var a =
        k.clone.call(this); a.words = this.words.slice(0); return a
    }, random: function (a) { for (var b = [], c = 0; c < a; c += 4)b.push(4294967296 * h.random() | 0); return i.create(b, a) }
  }), l = f.enc = {}, p = l.Hex = { stringify: function (a) { for (var b = a.words, a = a.sigBytes, c = [], d = 0; d < a; d++) { var e = b[d >>> 2] >>> 24 - 8 * (d % 4) & 255; c.push((e >>> 4).toString(16)); c.push((e & 15).toString(16)) } return c.join("") }, parse: function (a) { for (var b = a.length, c = [], d = 0; d < b; d += 2)c[d >>> 3] |= parseInt(a.substr(d, 2), 16) << 24 - 4 * (d % 8); return i.create(c, b / 2) } }, n = l.Latin1 = {
    stringify: function (a) {
      for (var b =
        a.words, a = a.sigBytes, c = [], d = 0; d < a; d++)c.push(String.fromCharCode(b[d >>> 2] >>> 24 - 8 * (d % 4) & 255)); return c.join("")
    }, parse: function (a) { for (var b = a.length, c = [], d = 0; d < b; d++)c[d >>> 2] |= (a.charCodeAt(d) & 255) << 24 - 8 * (d % 4); return i.create(c, b) }
  }, q = l.Utf8 = { stringify: function (a) { try { return decodeURIComponent(escape(n.stringify(a))) } catch (b) { throw Error("Malformed UTF-8 data"); } }, parse: function (a) { return n.parse(unescape(encodeURIComponent(a))) } }, m = j.BufferedBlockAlgorithm = k.extend({
    reset: function () {
    this._data = i.create();
      this._nDataBytes = 0
    }, _append: function (a) { "string" == typeof a && (a = q.parse(a)); this._data.concat(a); this._nDataBytes += a.sigBytes }, _process: function (a) { var b = this._data, c = b.words, d = b.sigBytes, e = this.blockSize, f = d / (4 * e), f = a ? h.ceil(f) : h.max((f | 0) - this._minBufferSize, 0), a = f * e, d = h.min(4 * a, d); if (a) { for (var g = 0; g < a; g += e)this._doProcessBlock(c, g); g = c.splice(0, a); b.sigBytes -= d } return i.create(g, d) }, clone: function () { var a = k.clone.call(this); a._data = this._data.clone(); return a }, _minBufferSize: 0
  }); j.Hasher = m.extend({
    init: function () { this.reset() },
    reset: function () { m.reset.call(this); this._doReset() }, update: function (a) { this._append(a); this._process(); return this }, finalize: function (a) { a && this._append(a); this._doFinalize(); return this._hash }, clone: function () { var a = m.clone.call(this); a._hash = this._hash.clone(); return a }, blockSize: 16, _createHelper: function (a) { return function (b, c) { return a.create(c).finalize(b) } }, _createHmacHelper: function (a) { return function (b, c) { return r.HMAC.create(a, c).finalize(b) } }
  }); var r = f.algo = {}; return f
}(Math);


    // Shortcuts
    var C = CryptoJS;
    var C_lib = C.lib;
    var WordArray = C_lib.WordArray;
    var C_enc = C.enc;

    /**
     * Base64 encoding strategy.
     */
    var Base64 = C_enc.Base64 = {
        /**
         * Converts a word array to a Base64 string.
         *
         * @param {WordArray} wordArray The word array.
         *
         * @return {string} The Base64 string.
         *
         * @static
         *
         * @example
         *
         *     var base64String = CryptoJS.enc.Base64.stringify(wordArray);
         */
        stringify: function (wordArray) {
            // Shortcuts
            var words = wordArray.words;
            var sigBytes = wordArray.sigBytes;
            var map = this._map;

            // Clamp excess bits
            wordArray.clamp();

            // Convert
            var base64Chars = [];
            for (var i = 0; i < sigBytes; i += 3) {
                var byte1 = (words[i >>> 2]       >>> (24 - (i % 4) * 8))       & 0xff;
                var byte2 = (words[(i + 1) >>> 2] >>> (24 - ((i + 1) % 4) * 8)) & 0xff;
                var byte3 = (words[(i + 2) >>> 2] >>> (24 - ((i + 2) % 4) * 8)) & 0xff;

                var triplet = (byte1 << 16) | (byte2 << 8) | byte3;

                for (var j = 0; (j < 4) && (i + j * 0.75 < sigBytes); j++) {
                    base64Chars.push(map.charAt((triplet >>> (6 * (3 - j))) & 0x3f));
                }
            }

            // Add padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                while (base64Chars.length % 4) {
                    base64Chars.push(paddingChar);
                }
            }

            return base64Chars.join('');
        },

        /**
         * Converts a Base64 string to a word array.
         *
         * @param {string} base64Str The Base64 string.
         *
         * @return {WordArray} The word array.
         *
         * @static
         *
         * @example
         *
         *     var wordArray = CryptoJS.enc.Base64.parse(base64String);
         */
        parse: function (base64Str) {
            // Shortcuts
            var base64StrLength = base64Str.length;
            var map = this._map;
            var reverseMap = this._reverseMap;

            if (!reverseMap) {
                    reverseMap = this._reverseMap = [];
                    for (var j = 0; j < map.length; j++) {
                        reverseMap[map.charCodeAt(j)] = j;
                    }
            }

            // Ignore padding
            var paddingChar = map.charAt(64);
            if (paddingChar) {
                var paddingIndex = base64Str.indexOf(paddingChar);
                if (paddingIndex !== -1) {
                    base64StrLength = paddingIndex;
                }
            }

            // Convert
            return parseLoop(base64Str, base64StrLength, reverseMap);

        },

        _map: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    };

    function parseLoop(base64Str, base64StrLength, reverseMap) {
      var words = [];
      var nBytes = 0;
      for (var i = 0; i < base64StrLength; i++) {
          if (i % 4) {
              var bits1 = reverseMap[base64Str.charCodeAt(i - 1)] << ((i % 4) * 2);
              var bits2 = reverseMap[base64Str.charCodeAt(i)] >>> (6 - (i % 4) * 2);
              words[nBytes >>> 2] |= (bits1 | bits2) << (24 - (nBytes % 4) * 8);
              nBytes++;
          }
      }
      return WordArray.create(words, nBytes);
    }

    function encode (signstr) {
      var str = CryptoJS.enc.Utf8.parse(signstr);
      var base64 = CryptoJS.enc.Base64.stringify(str);
      return base64
    }
module.exports = {
  encode: encode
}
