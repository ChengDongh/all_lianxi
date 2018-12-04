var utils = require('util.js')
var Base64 = require('enc-base64.js')

var rotateLeft = function (lValue, iShiftBits) {
  return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
}

var lsbHex = function (value) {
  var string = "";
  var i;
  var vh;
  var vl;
  for (i = 0; i <= 6; i += 2) {
    vh = (value >>> (i * 4 + 4)) & 0x0f;
    vl = (value >>> (i * 4)) & 0x0f;
    string += vh.toString(16) + vl.toString(16);
  }
  return string;
};

var cvtHex = function (value) {
  var string = "";
  var i;
  var v;
  for (i = 7; i >= 0; i--) {
    v = (value >>> (i * 4)) & 0x0f;
    string += v.toString(16);
  }
  return string;
};

var uTF8Encode = function (string) {
  string = string.replace(/\x0d\x0a/g, "\x0a");
  var output = "";
  for (var n = 0; n < string.length; n++) {
    var c = string.charCodeAt(n);
    if (c < 128) {
      output += String.fromCharCode(c);
    } else if ((c > 127) && (c < 2048)) {
      output += String.fromCharCode((c >> 6) | 192);
      output += String.fromCharCode((c & 63) | 128);
    } else {
      output += String.fromCharCode((c >> 12) | 224);
      output += String.fromCharCode(((c >> 6) & 63) | 128);
      output += String.fromCharCode((c & 63) | 128);
    }
  }
  return output;
};

var sha1 = function (string) {
  var blockstart;
  var i, j;
  var W = new Array(80);
  var H0 = 0x67452301;
  var H1 = 0xEFCDAB89;
  var H2 = 0x98BADCFE;
  var H3 = 0x10325476;
  var H4 = 0xC3D2E1F0;
  var A, B, C, D, E;
  var tempValue;
  string = uTF8Encode(string);
  var stringLength = string.length;
  var wordArray = new Array();
  for (i = 0; i < stringLength - 3; i += 4) {
    j = string.charCodeAt(i) << 24 | string.charCodeAt(i + 1) << 16 | string.charCodeAt(i + 2) << 8 | string.charCodeAt(i + 3);
    wordArray.push(j);
  }
  switch (stringLength % 4) {
    case 0:
      i = 0x080000000;
      break;
    case 1:
      i = string.charCodeAt(stringLength - 1) << 24 | 0x0800000;
      break;
    case 2:
      i = string.charCodeAt(stringLength - 2) << 24 | string.charCodeAt(stringLength - 1) << 16 | 0x08000;
      break;
    case 3:
      i = string.charCodeAt(stringLength - 3) << 24 | string.charCodeAt(stringLength - 2) << 16 | string.charCodeAt(stringLength - 1) << 8 | 0x80;
      break;
  }
  wordArray.push(i);
  while ((wordArray.length % 16) != 14) wordArray.push(0);
  wordArray.push(stringLength >>> 29);
  wordArray.push((stringLength << 3) & 0x0ffffffff);
  for (blockstart = 0; blockstart < wordArray.length; blockstart += 16) {
    for (i = 0; i < 16; i++) W[i] = wordArray[blockstart + i];
    for (i = 16; i <= 79; i++) W[i] = rotateLeft(W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16], 1);
    A = H0;
    B = H1;
    C = H2;
    D = H3;
    E = H4;
    for (i = 0; i <= 19; i++) {
      tempValue = (rotateLeft(A, 5) + ((B & C) | (~B & D)) + E + W[i] + 0x5A827999) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotateLeft(B, 30);
      B = A;
      A = tempValue;
    }
    for (i = 20; i <= 39; i++) {
      tempValue = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0x6ED9EBA1) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotateLeft(B, 30);
      B = A;
      A = tempValue;
    }
    for (i = 40; i <= 59; i++) {
      tempValue = (rotateLeft(A, 5) + ((B & C) | (B & D) | (C & D)) + E + W[i] + 0x8F1BBCDC) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotateLeft(B, 30);
      B = A;
      A = tempValue;
    }
    for (i = 60; i <= 79; i++) {
      tempValue = (rotateLeft(A, 5) + (B ^ C ^ D) + E + W[i] + 0xCA62C1D6) & 0x0ffffffff;
      E = D;
      D = C;
      C = rotateLeft(B, 30);
      B = A;
      A = tempValue;
    }
    H0 = (H0 + A) & 0x0ffffffff;
    H1 = (H1 + B) & 0x0ffffffff;
    H2 = (H2 + C) & 0x0ffffffff;
    H3 = (H3 + D) & 0x0ffffffff;
    H4 = (H4 + E) & 0x0ffffffff;
  }
  var tempValue = cvtHex(H0) + cvtHex(H1) + cvtHex(H2) + cvtHex(H3) + cvtHex(H4);
  return tempValue.toLowerCase();
}


if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }
      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}
if (!Object.keys) {
  Object.keys = (function () {
    var hasOwnProperty = Object.prototype.hasOwnProperty,
      hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
      dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
      ],
      dontEnumsLength = dontEnums.length;

    return function (obj) {
      if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

      var result = [];

      for (var prop in obj) {
        if (hasOwnProperty.call(obj, prop)) result.push(prop);
      }

      if (hasDontEnumBug) {
        for (var i = 0; i < dontEnumsLength; i++) {
          if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
        }
      }
      return result;
    }
  })()
};

var ktopUtils = {
  hostname: function () {
    var url = 'yiapi.qiqiangkeji.com';
    return url;
  }(),
  appSec: 'fcb71c530f684f9bb04c98c8cf44fbd5',
  defaultDefault: {
    ttid: 'kmeila',
    appKey: '52ce9b3a15a84324b7920ad9fecf2ba7',
    appVersion: '1.2.0',
    osType: 3,
    osVersion: '1.0.0',
    hwId: 'wx-h5',
    mobileType: 'wx-h5'
  },
  merge: function (params) {
    params = params || {};
    var str = '';
    str += ktopUtils.appSec;
    var keys = Object.keys(params);
    keys.sort().reverse();
    for (var k = 0, len = keys.length; k < len; k++) {
      str += keys[k];
      str += params[keys[k]];
    }
    str += ktopUtils.appSec;
    return str;
  },
  h5SignAlgorithm: function (merged) {
    var b64 = Base64.encode(merged)
    return sha1(b64);
  },
  getRequestUrl: function (params) {
    var url = 'https://' + ktopUtils.hostname;
    url = url + params.api;
    url += '?';
    var value;
    var result = [];
    for (var k in params) {
      k = encodeURIComponent(k);
      value = params[k];
      if (value) {
        value = encodeURIComponent(value);
      } else {
        value = '';
      }
      result.push(k + '=' + value);
    }
    url += result.join('&');
    // console.log(url)
    return url;
  }
}
var ktop = {
  request: function (option) {
    option = option || {};
    var api = option.api;
    var apiVersion = '1.0.0';
    var data = option.data || {};
    var finish = option.finish;
    var app = getApp()
    if (app.user.id) {
      data.kmlUserId = app.user.id
      data.kmlToken = app.user.token
    }
    if (!api) {
      return;
    }
    var params = Object.assign({}, ktopUtils.defaultDefault, {
      api: api,
      apiVersion: apiVersion,
      timestamp: new Date().getTime()
    });
    var mergeParam = Object.assign({}, params, data);
    var sign = ktopUtils.h5SignAlgorithm(ktopUtils.merge(mergeParam));
    params.sign = sign;
    var url = ktopUtils.getRequestUrl(params);
    // console.log(data)
    // var dataJson = encodeURIComponent(JSON.stringify(data));
    var dataJson = data;
    if (option.loading) {
      wx.showToast({
        title: '加载中',
        icon: 'loading'
      })
    }
    wx.request({
      url: url,
      method: 'POST',
      data: dataJson,
      dataType: "json",
      success: function (response) {
        response = response || {};
        var result = response.data
        var code = result.code;
        var msg = result.msg;
        var data = result.data || {};
        // console.log(api + "---")
        // console.log(option.data)
        // console.log(result)
        if (code == 200) {
          if (option.loading) {
            wx.hideToast()
          }
          finish && finish(data, 0);
        } else {
          if (code == 202 || code == 206) {
            app.user = {}
            wx.redirectTo({
              url: '/pages/welcome/welcome'
            })
          } else if (code == 203 || code == 204) {
            app.getUserInfo(1)
            result.msg = '请求出错，请重试';
          } else {
            result.msg = msg || '请求出错，请重试';
          }
          // wx.showToast({
          //     title: result.msg
          // })
          finish && finish(result, 1);
        }
      },
      fail: function () {
        wx.showToast({
          title: '网络请求失败，请稍后重试'
        })
        finish && finish({
          msg: '网络请求失败，请稍后重试'
        }, 2);
      }
    });
  },
  uploadFile(option) {
    wx.showLoading({
      title: '图片上传中！',
      mask: true
    })
    var finish = option.finish
    wx.uploadFile({
      url: 'https://yiapi.qiqiangkeji.com/upload',
      filePath: option.path,
      name: 'img',
      formData: {
        filename: "1.jpeg"
      },
      success: function (res) {
        wx.hideLoading();
        if (res.statusCode == 200) {
          // var result = utils.removewebp(data)
          // result = result.replace(new RegExp(/(\")/g),'')
          finish && finish(res.data, 0);
        } else {
          finish && finish(res.msg, 1);
        }
      },
      fail: function () {
        finish && finish({
          msg: '网络请求失败，请稍后重试'
        }, 2);
      }
    })
  }
}

module.exports = ktop;